import os, sys, math
SP=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(os.path.dirname(SP),'sv'))
from PIL import Image, ImageDraw, ImageFont
from spec import SPEC
CELL=640
try: f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',26)
except: f=ImageFont.load_default()
tiles=[]
for sl in sorted(SPEC):
    p=os.path.join(SP,'slides',SPEC[sl]['name'].replace('_','_sq_',1)+'.png')
    if not os.path.exists(p): continue
    im=Image.open(p).convert('RGB').resize((CELL,CELL), Image.LANCZOS)
    tiles.append((sl,im))
COLS=5; rows=math.ceil(len(tiles)/COLS)
W=COLS*(CELL+16)+16; H=rows*(CELL+44)+16
sh=Image.new('RGB',(W,H),(20,20,22)); d=ImageDraw.Draw(sh)
for i,(sl,im) in enumerate(tiles):
    x=16+(i%COLS)*(CELL+16); y=16+(i//COLS)*(CELL+44)
    sh.paste(im,(x,y)); d.text((x+2,y+CELL+8), f"{sl}  {SPEC[sl]['head'][0]}{SPEC[sl]['head'][1]}", font=f, fill=(255,215,0))
sh.save(os.path.join(SP,'contact-sheet-square.png')); print(sh.size)
