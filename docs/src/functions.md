# References

### Meshes

```@docs
FDMesh
FDMeshGPU
CubicMeshGPU
TriangularMeshGPU
```



### DataTypes

```@docs
JuMag.NumberOrArrayOrFunction
JuMag.NumberOrArray
JuMag.TupleOrArrayOrFunction
```



### Interfaces

```@docs
Sim
set_Ms
set_Ms_cylindrical
create_box
create_cylinder
set_mu_s
init_m0
init_m0_random
init_m0_skyrmion
add_exch
add_anis
add_cubic_anis
add_dmi
add_demag
add_zeeman
add_exch_vector
add_exch_kagome
add_anis_kagome
add_exch_anis
update_zeeman
update_anis
relax
```



### DataSaving

```@docs
save_m
save_vtk
save_ovf
read_ovf
effective_field
compute_system_energy
compute_fields_to_gpu
```



### Tools

```@docs
ovf2vtk
mag2ovf
show_mag
```

