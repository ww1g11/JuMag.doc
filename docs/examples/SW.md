when θ=pi/4, [Stoner–Wohlfarth model](https://en.wikipedia.org/wiki/Stoner%E2%80%93Wohlfarth_model) can be written as follows:
```julia
using JuMag
using Printf
using NPZ

mesh =  FDMesh(nx=16, ny=16, nz=1, dx=2.5e-9, dy=2.5e-9, dz=2.5e-9)
mT = 0.001 / (4*pi*1e-7)
function relax_system(mesh)
sim = Sim(mesh, name="SW_dyn2", driver="LLG")
set_Ms(sim, 1.0e6)
sim.driver.alpha=0.02
sim.driver.precession= false
add_exch(sim, 1.3e-11)
init_m0(sim, (1, 0.25, -0.01))
add_anis(sim,3e4,axis=(1,0,1))
z=add_zeeman(sim,(0,0,-120*mT))

relax(sim, maxsteps=5000,stopping_dmdt=0.01,save_m_every=100000)
 


for i=-120:1:120
    update_zeeman(z,(0,0,(i)*mT))
    relax(sim, maxsteps=5000, stopping_dmdt=0.01,save_m_every=10000)
end
for i=-120:1:120
    update_zeeman(z,(0,0,(-i)*mT))
    relax(sim, maxsteps=5000, stopping_dmdt=0.01,save_m_every=10000)
end

end
relax_system(mesh)

```
The hysteresis loops is plotted below using python scripts:
![Stoner–Wohlfarth model(θ=pi/4)](scripts/sw.png)
