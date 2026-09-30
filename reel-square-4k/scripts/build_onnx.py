# Torch-free loader for a torch.save() zip, then build SRVGGNetCompact as ONNX.
import zipfile, pickle, numpy as np, collections, onnx
from onnx import helper, TensorProto, numpy_helper
import os, sys
PTH=os.environ.get('SR_PTH','/tmp/realesr-general-x4v3.pth')
OUT=os.environ.get('SR_MODEL','/opt/sr/realesr-general-x4v3.onnx')
zf=zipfile.ZipFile(PTH); names=zf.namelist(); root=names[0].split('/')[0]
class Storage:
    def __init__(s,dtype): s.dtype=dtype
DT={'FloatStorage':np.float32,'HalfStorage':np.float16,'DoubleStorage':np.float64,'LongStorage':np.int64,'IntStorage':np.int32}
def rebuild(storage, offset, size, stride, *a):
    arr=storage
    n=int(np.prod(size)) if len(size) else 1
    if len(size)==0: return arr[offset:offset+1].reshape(())
    return np.lib.stride_tricks.as_strided(arr[offset:], shape=size, strides=[s*arr.itemsize for s in stride]).copy()
class U(pickle.Unpickler):
    def find_class(self, mod, name):
        if name=='_rebuild_tensor_v2': return rebuild
        if name=='_rebuild_parameter': return lambda d,*a: d
        if mod=='collections' and name=='OrderedDict': return collections.OrderedDict
        if name in DT: return Storage(DT[name])
        return super().find_class(mod,name)
    def persistent_load(self, pid):
        _, st, key, loc, numel = pid
        return np.frombuffer(zf.read(f'{root}/data/{key}'), dtype=st.dtype)
sd=U(zf.open(f'{root}/data.pkl')).load()
if 'params' in sd: sd=sd['params']
for k,v in list(sd.items())[:5]: print(k, v.shape)
print(len(sd), list(sd.keys())[-4:])
nodes=[]; inits=[]; cur='input'
idx=sorted({int(k.split('.')[1]) for k in sd})
for i in idx:
    w=sd[f'body.{i}.weight']
    if w.ndim==4:
        inits += [numpy_helper.from_array(w.astype(np.float32), f'w{i}'), numpy_helper.from_array(sd[f'body.{i}.bias'].astype(np.float32), f'b{i}')]
        nodes.append(helper.make_node('Conv',[cur,f'w{i}',f'b{i}'],[f'c{i}'],pads=[1,1,1,1],kernel_shape=[3,3])); cur=f'c{i}'
    else:
        inits.append(numpy_helper.from_array(w.astype(np.float32).reshape(-1,1,1), f'p{i}'))
        nodes.append(helper.make_node('PRelu',[cur,f'p{i}'],[f'a{i}'])); cur=f'a{i}'
nodes.append(helper.make_node('DepthToSpace',[cur],['ps'],blocksize=4,mode='CRD'))
inits.append(numpy_helper.from_array(np.array([1,1,4,4],dtype=np.float32),'scales'))
nodes.append(helper.make_node('Resize',['input','','scales'],['up'],mode='nearest'))
nodes.append(helper.make_node('Add',['ps','up'],['output']))
g=helper.make_graph(nodes,'srvgg',[helper.make_tensor_value_info('input',TensorProto.FLOAT,[1,3,None,None])],[helper.make_tensor_value_info('output',TensorProto.FLOAT,[1,3,None,None])],inits)
m=helper.make_model(g,opset_imports=[helper.make_opsetid('',17)],ir_version=9); onnx.checker.check_model(m); onnx.save(m,OUT); print('saved')
