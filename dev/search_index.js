var documenterSearchIndex = {"docs":
[{"location":"#JuMag.jl-1","page":"JuMag.jl","title":"JuMag.jl","text":"","category":"section"},{"location":"#","page":"JuMag.jl","title":"JuMag.jl","text":"A Julia package for classical spin dynamics and micromagnetic simulations with GPU support.","category":"page"},{"location":"tutorial/#Tutorial-1","page":"Tutorial","title":"Tutorial","text":"","category":"section"},{"location":"tutorial/#An-example-–-vortex-1","page":"Tutorial","title":"An example – vortex","text":"","category":"section"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"To start a micromagnetic simulation, we first create a FDMesh","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"mesh = FDMesh(dx=2e-9, dy=2e-9, dz=2e-9, nx=100, ny=100)","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"After that, we create a simulation","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"sim = Sim(mesh, name=\"vortex\")","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"and set the damping to 0.5 and switch off the precession term in LLG equation:","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"sim.driver.alpha = 0.5\nsim.driver.precession = false","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"The geometry of the system can be defined by","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"set_Ms(sim, circular_Ms)","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"where circular_Ms could be a scalar or a function. The function should take six parameters (i,j,k,dx,dy,dz), for instance","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"function circular_Ms(i,j,k,dx,dy,dz)\n    if (i-50.5)^2 + (j-50.5)^2 <= 50^2\n        return 8.6e5\n    end\n    return 0.0\nend","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"We add the exchange interaction and the demagnetization field to the system.","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"add_exch(sim, 1.3e-11)\nadd_demag(sim)","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"We need to initialise the system which can be done by defining a function","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"function init_fun(i,j,k,dx,dy,dz)\n  x = i-50.5\n  y = j-50.5\n  r = (x^2+y^2)^0.5\n  if r<5\n    return (0,0,1)\n  end\n  return (y/r, -x/r, 0)\nend","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"and using","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"init_m0(sim, init_fun)","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"To trigger the simulation we relax the system","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"relax(sim, maxsteps=1000)","category":"page"},{"location":"tutorial/#How-to-enable-GPU-1","page":"Tutorial","title":"How to enable GPU","text":"","category":"section"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"Using FDMeshGPU instead of FDMesh to switch on the GPU calculation,","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"mesh = FDMeshGPU(dx=2e-9, dy=2e-9, dz=2e-9, nx=100, ny=100)","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"The script to use GPU to obtain the vortex structure is shown below:","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"using JuMag\nusing Printf\nusing NPZ\n\nJuMag.cuda_using_double(true)\nmesh =  FDMeshGPU(dx=2e-9, dy=2e-9, dz=5e-9, nx=100, ny=100, nz=4)\n\nfunction circular_Ms(i,j,k,dx,dy,dz)\n    x = i-50.5\n    y = j-50.5\n    r = (x^2+y^2)^0.5\n    if (i-50.5)^2 + (j-50.5)^2 <= 50^2\n        return 8e5\n    end\n    return 0.0\nend\n\nfunction init_fun(i,j,k,dx,dy,dz)\n  x = i-50.5\n  y = j-50.5\n  r = (x^2+y^2)^0.5\n  if r<5\n    return (0,0,1)\n  end\n  return (y/r, -x/r, 0)\nend\n\nfunction relax_system()\n  sim = Sim(mesh, driver=\"SD\", name=\"sim\")\n  set_Ms(sim, circular_Ms)\n\n  add_exch(sim, 1.3e-11, name=\"exch\")\n  add_demag(sim)\n\n  init_m0(sim, init_fun)\n  relax(sim, maxsteps=2000, stopping_torque=1.0, save_vtk_every = 100, save_m_every=-1)\n  npzwrite(\"m0.npy\", sim.spin)\nend\n\nrelax_system()","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"##Standard Problem #4","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"using JuMag\nusing Printf\nusing NPZ\n\nmesh =  FDMeshGPU(nx=200, ny=50, nz=1, dx=2.5e-9, dy=2.5e-9, dz=3e-9)\n\nfunction relax_system(mesh)\n  sim = Sim(mesh, name=\"std4_relax\", driver=\"SD\")\n  set_Ms(sim, 8.0e5)\n  sim.driver.min_tau = 1e-10\n\n  add_exch(sim, 1.3e-11)\n  add_demag(sim)\n\n  init_m0(sim, (1, 0.25, 0.1))\n\n  relax(sim, maxsteps=5000, stopping_torque=10.0)\n  npzwrite(\"m0.npy\", Array(sim.spin))\nend\n\nfunction apply_field1(mesh)\n  sim = Sim(mesh, name=\"std4_dyn\")\n  set_Ms(sim, 8.0e5)\n  sim.driver.alpha = 0.02\n  sim.driver.gamma = 2.211e5\n\n  mT = 0.001 / (4*pi*1e-7)\n  add_exch(sim, 1.3e-11)\n  add_demag(sim)\n  add_zeeman(sim, (-24.6*mT, 4.3*mT, 0))\n\n  init_m0(sim, npzread(\"m0.npy\"))\n\n  for i=1:100\n    run_until(sim, 1e-11*i)\n  end\nend\n\nrelax_system(mesh)\nprintln(\"Start step2 !!!\")\napply_field1(mesh)\nprintln(\"Run step2 again!!!\")\n@time apply_field1(mesh)\nprintln(\"Done!\")","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"The output file is a simple text compatible with Gnuplot, like used for plot below.","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"(Image: std4)","category":"page"},{"location":"equations/#Implemented-equations-1","page":"Implemented equations","title":"Implemented equations","text":"","category":"section"},{"location":"equations/#Energies-1","page":"Implemented equations","title":"Energies","text":"","category":"section"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"Exchange energy\nE_mathrmex = int_V A (nabla vecm)^2 mathrmdV\nBulk DMI energy\nE_mathrmdmi = int_V D vecm cdot (nabla times vecm)  mathrmdV\nAnisotropy","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"E_mathrmanis = int_V K_u  1 - (vecm cdot hatu)^2  dV","category":"page"},{"location":"equations/#LLG-equation-1","page":"Implemented equations","title":"LLG equation","text":"","category":"section"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"The LLG equation is written as","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"fracpartial vecmpartial t = - gamma vecm times vecH + alpha vecm times  fracpartial vecmpartial t","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"and the corresponding LL form is given by","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"(1+alpha^2)fracpartial vecmpartial t = - gamma vecm times vecH - alpha gamma vecm times (vecm times vecH)","category":"page"},{"location":"equations/#LLG-equation-with-extensions-1","page":"Implemented equations","title":"LLG equation with extensions","text":"","category":"section"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"For the driver LLG_STT_CPP the implemented equations is","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"fracpartial vecmpartial t = - gamma vecm times vecH + alpha vecm times  fracpartial vecmpartial t\n+ (vecu cdot nabla) vecm - beta vecmtimes (vecu cdot nabla)vecm - a_J vecm times (vecm times vecp)\n - eta a_J vecm times vecp","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"The simulation related to spin transfer torques (in-plane and current-perpendicular-to-plane) and the spin orbit torques can use the LLG_STT_CPP driver.","category":"page"},{"location":"equations/#Monte-Carlo-Simulation-1","page":"Implemented equations","title":"Monte Carlo Simulation","text":"","category":"section"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"For triangular mesh (2D), the system energy reads","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"H= sum_langle i jrangle  vecD_i j cdotleft(vecS_i times vecS_jright)\n-J sum_langle i jrangle vecS_i cdot vecS_j- lambda sum_langle i jrangle S_i^z S_j^z\n-K sum_ileft(S_i^zright)^2","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"where","category":"page"},{"location":"equations/#","page":"Implemented equations","title":"Implemented equations","text":"vecD_i j = D hatz times hatr_ij  + D_z^j hatz","category":"page"},{"location":"notes/#Notes-1","page":"Notes","title":"Notes","text":"","category":"section"},{"location":"notes/#Reducing-the-startup-time-1","page":"Notes","title":"Reducing the startup time","text":"","category":"section"},{"location":"notes/#","page":"Notes","title":"Notes","text":"Julia is a dynamically-typed language, so the input script will be compiled when we start a simulation. However, the typical startup time in our case ranges from 1s to 30s depends on the complexity of the problem. It is painful especially if we run the simulation using GPU. Luckily, we can compile our package using PackageCompiler.jl:","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"using PackageCompiler\ncompile_incremental(:JuMag)","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"After finishing the compilation, a dyn.so file will be generated. If we start julia using julia -J /path/to/dyn.so the stratup time will be ignorable.","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"Note: If you got an error similar to that shown at https://github.com/JuliaLang/PackageCompiler.jl/issues/184, using dev PackageCompiler may solve the issue.","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"If other errors appear, it is better to figure out which package is failed","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"compile_incremental(:FFTW, :CUDAdrv, :CUDAnative, :CuArrays, force=false)","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"and remove that package from deps in Project.toml. For example, if CuArrays fails, comment the line","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"#CuArrays = \"3a865a2d-5b23-5a0f-bc46-62713ec82fae\"","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"may solve the problem.","category":"page"},{"location":"notes/#LLG-equation-with-Zhang-Li-extension-1","page":"Notes","title":"LLG equation with Zhang-Li extension","text":"","category":"section"},{"location":"notes/#","page":"Notes","title":"Notes","text":"fracpartial vecmpartial t = - gamma vecm times vecH + alpha vecm times  fracpartial vecmpartial t   + u_0 (vecj_s cdot nabla) vecm - beta u_0 vecmtimes (vecj_s cdot nabla)vecm","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"where","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"u_0=fracp g mu_B2 e M_s=fracp g mu_B a^32 e mu_s","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"and mu_B=ehbar(2m) is the Bohr magneton. In LL form","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"(1+alpha^2)fracpartial vecmpartial t = - gamma vecm times vecH - alpha gamma vecm times (vecm times vecH) + (1+alphabeta) u_0 vectau - (beta-alpha) u_0 (vecmtimes vectau)","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"where vectau=(vecj_s cdot nabla)vecm","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"Note that","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"u_0 (vecj_s cdot nabla) vecm=  - u_0 vecmtimesvecmtimes (vecj_s cdot nabla)vecm","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"so this torque is damping-like torque and the last torque is field-like torque. Therefore, we rewrite the LLG equation in the form","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"fracpartial vecmpartial t =\nF(vecm)\ntimes vecm","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"where","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"F(vecm) = frac1(1+alpha^2)\ngamma vecH + u_0 (beta-alpha)vectau+\nfrac1(1+alpha^2)vecm times alpha gamma\n  vecH + u_0 (1+alphabeta) vectau","category":"page"},{"location":"notes/#Cayley-transformation-1","page":"Notes","title":"Cayley transformation","text":"","category":"section"},{"location":"notes/#","page":"Notes","title":"Notes","text":"The LLG equation can be cast into","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"fracpartial vecmpartial t = hatF(vecm) cdot vecm","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"where the operator \\hat{} is defined as","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"hatx = left( beginmatrix\n  0  -x_3  x_2 \n  x_3  0  -x_1 \n  -x_2  x_1  0\n endmatrix right)","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"Using the Cayley transfromation, the LLG equation can be written as","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"fracpartial Omegapartial t = F - frac12 Omega F\n- frac14 Omega F Omega","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"where","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"Omega = hatomega","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"So one has","category":"page"},{"location":"notes/#","page":"Notes","title":"Notes","text":"fracpartial vecomegapartial t = vecF - frac12\n(omega times vecF)\n+ frac14 (omega cdot vecF) vecomega","category":"page"},{"location":"functions/#Function-reference-1","page":"Function reference","title":"Function reference","text":"","category":"section"},{"location":"functions/#","page":"Function reference","title":"Function reference","text":"FDMesh\nSim","category":"page"},{"location":"functions/#JuMag.FDMesh","page":"Function reference","title":"JuMag.FDMesh","text":"FDMesh(;dx=1e-9, dy=1e-9, dz=1e-9, nx=1, ny=1, nz=1, pbc=\"open\")\n\nCreate a FDMesh for given parameters. pbc could be any combination of \"x\", \"y\" and \"z\".\n\n\n\n\n\n","category":"type"},{"location":"functions/#JuMag.Sim","page":"Function reference","title":"JuMag.Sim","text":"Sim(mesh::Mesh; driver=\"LLG\", name=\"dyn\", integrator=\"Dopri5\")\n\nCreate a simulation instance for given mesh.\n\n\n\n\n\n","category":"function"}]
}
