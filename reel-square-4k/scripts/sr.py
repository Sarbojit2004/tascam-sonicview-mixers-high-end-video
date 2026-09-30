import numpy as np, onnxruntime as ort, sys, time, os
MODEL=os.environ.get('SR_MODEL','/opt/sr/realesr-general-x4v3.onnx')
from PIL import Image
_s=None
def sess():
    global _s
    if _s is None:
        o=ort.SessionOptions(); o.intra_op_num_threads=4; o.graph_optimization_level=ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        _s=ort.InferenceSession(MODEL,o,providers=['CPUExecutionProvider'])
    return _s
def upscale(rgb, tile=256, pad=12):
    """rgb: HxWx3 uint8 -> 4H x 4W x 3 uint8, tiled with overlap."""
    s=sess(); h,w,_=rgb.shape; x=rgb.astype(np.float32)/255.
    out=np.zeros((h*4,w*4,3),np.float32)
    for y0 in range(0,h,tile):
        for x0 in range(0,w,tile):
            y1=min(y0+tile,h); x1=min(x0+tile,w)
            ya=max(0,y0-pad); xa=max(0,x0-pad); yb=min(h,y1+pad); xb=min(w,x1+pad)
            t=x[ya:yb,xa:xb].transpose(2,0,1)[None]
            r=s.run(None,{'input':t})[0][0].transpose(1,2,0)
            out[y0*4:y1*4, x0*4:x1*4]=r[(y0-ya)*4:(y0-ya+y1-y0)*4, (x0-xa)*4:(x0-xa+x1-x0)*4]
    return (np.clip(out,0,1)*255+0.5).astype(np.uint8)
if __name__=='__main__':
    im=np.array(Image.open(sys.argv[1]).convert('RGB')); t=time.time(); o=upscale(im); print(im.shape,'->',o.shape,'%.1fs'%(time.time()-t)); Image.fromarray(o).save(sys.argv[2])
