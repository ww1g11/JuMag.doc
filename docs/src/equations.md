# Implemented equations

### Energies and effective field

In micromagnetics, the effective field can be computed from the total micromagnetic energy

```math
\vec{H}_{\mathrm{eff}}=-\frac{1}{\mu_{0} M_{s}} \frac{\delta E}{\delta \vec{m}}
```

The typical energy terms are

- **Exchange energy**

```math
E_\mathrm{ex} = \int_{V} A (\nabla \vec{m})^2 \mathrm{d}V
```
where ``(\nabla \vec{m})^{2}=\left(\nabla m_{x}\right)^{2}+\left(\nabla m_{y}\right)^{2}+\left(\nabla m_{z}\right)^{2}``.
So the corresponding effective field is
```math
\vec{H}_{\mathrm{ex}}=\frac{2 A}{\mu_{0} M_{s}} \nabla^{2} \vec{m}
```

- **Zeeman energy**
```math
E_\mathrm{ex} = -  \mu_0 \int_{V}  \vec{H} \cdot \vec{M} \mathrm{d}V
```
as expected, the effective field is ``\vec{H}``.

- **Anisotropy**

The uniaxial anisotropy energy is given by
```math
E_\mathrm{anis} = -\int_{V} K_{u} (\vec{m} \cdot \hat{u})^2 \, dV
```
from which the effective field can be computed as
```math
\vec{H}_{\mathrm{an}}=\frac{2 K_u}{\mu_0 M_s}\left(\vec{m} \cdot \hat{u}\right) \hat{u}
```

- **Bulk DMI energy**
The Bulk DMI energy reads

```math
E_{\mathrm{dmi}} = \int_V D \vec{m} \cdot (\nabla \times \vec{m}) \, \mathrm{d}V
```

so the effective field is

```math
\vec{H}_\mathrm{D}=-\frac{2 D}{\mu_{0} M_{s}}(\nabla \times \vec{m})
```

- **Magnetostatic energy**
```math
E_{\mathrm{d}}=-\frac{\mu_{0}}{2} \int_{V} \vec{H}_{\mathrm{d}}(\mathbf{r}) \cdot
\vec{M}(\mathbf{r}) d V
```
```math
\vec{H}_{\mathrm{d}}(\mathbf{r})=\frac{1}{4 \pi}\left(\int_{V} \rho_{m}\left(\mathbf{r}^{\prime}\right) \frac{\mathbf{r}-\mathbf{r}^{\prime}}{\left|\mathbf{r}-\mathbf{r}^{\prime}\right|^{3}} \mathrm{d}^{3} r^{\prime}+\int_{S} \sigma_{m}\left(\mathbf{r}^{\prime}\right) \frac{\mathbf{r}-\mathbf{r}^{\prime}}{\left|\mathbf{r}-\mathbf{r}^{\prime}\right|^{3}} \mathrm{d}^{2} r^{\prime}\right)
```

## LLG equation

The LLG equation is written as

```math
\frac{\partial \vec{m}}{\partial t} = - \gamma \vec{m} \times \vec{H} + \alpha \vec{m} \times  \frac{\partial \vec{m}}{\partial t}
```

and the corresponding LL form is given by

```math
(1+\alpha^2)\frac{\partial \vec{m}}{\partial t} = - \gamma \vec{m} \times \vec{H} - \alpha \gamma \vec{m} \times (\vec{m} \times \vec{H})
```

## LLG equation with extensions

For the driver `LLG_STT_CPP` the implemented equations is

```math
\frac{\partial \vec{m}}{\partial t} = - \gamma \vec{m} \times \vec{H} + \alpha \vec{m} \times  \frac{\partial \vec{m}}{\partial t}
+ (\vec{u} \cdot \nabla) \vec{m} - \beta [\vec{m}\times (\vec{u} \cdot \nabla)\vec{m}] - a_J \vec{m} \times (\vec{m} \times \vec{p})
 - \eta a_J \vec{m} \times \vec{p}
```

The simulation related to spin transfer torques (in-plane and current-perpendicular-to-plane) and the spin orbit torques can use the `LLG_STT_CPP` driver.
## Steepest descent method
We provide a steepest descent energy minimization method for a complicated system,which is of the form

```math
x_{k+1} = x_k + \alpha_k d_k
```
where
```math
d_k = - \nabla f(x_k)
```
And for the micromagnetics, we have
```math
\mathbf{m}_{k+1} = \mathbf{m}_{k} - {\tau}_k \mathbf{m}_k  \times (\mathbf{m}_k \times \mathbf{H}_{\mathrm{eff}})
```
In practice, we use the following update rule to keep the magnetization vector normalized.

```math
\boldsymbol{m}_{k+1}=\boldsymbol{m}_{k}-{\tau}_k \frac{\boldsymbol{m}_{k}+\boldsymbol{m}_{k+1}}{2} \times\left(\boldsymbol{m}_{k} \times \boldsymbol{H}_{\mathrm{eff}}\left(\boldsymbol{m}_{k}\right)\right)
```
```math
\boldsymbol{m}_{k+1}^2 = \boldsymbol{m}_{k}^2
```
From the equation we have:
```math
(1+\frac{{\tau}_k^2}{4} \boldsymbol{f}_k^2)\mathbf{m}_{k+1} =
(1-\frac{{\tau}_k^2}{4} \boldsymbol{f}_k^2)\mathbf{m}_{k} -  {\tau}_k \mathbf{g}_k
```
where

```math
\begin{aligned}
\mathbf{f}_k& = \mathbf{m}_k \times \mathbf{H}_{\mathrm{eff}}
\\\boldsymbol{g}_{k} &=\boldsymbol{m}_{k} \times\left(\boldsymbol{m}_{k} \times \boldsymbol{H}_{\mathrm{eff}}\right)
\end{aligned}
```
The step size $\tau_k$  can be computed by

```math
\tau_{k}^{1}=\frac{\sum_{i} \boldsymbol{s}_{k-1}^{i} \cdot \boldsymbol{s}_{k-1}^{i}}{\sum_{i} \boldsymbol{s}_{k-1}^{i} \cdot \boldsymbol{y}_{k-1}^{i}} \quad, \quad \tau_{k}^{2}=\frac{\sum_{i} \boldsymbol{s}_{k-1}^{i} \cdot \boldsymbol{y}_{k-1}^{i}}{\sum_{i} \boldsymbol{y}_{k-1}^{i} \cdot \boldsymbol{y}_{k-1}^{i}}
```
where

```math
\begin{aligned}  \boldsymbol{s}_{k-1} &=\boldsymbol{m}_{k}-\boldsymbol{m}_{k-1} \\ \boldsymbol{y}_{k-1} &=\boldsymbol{g}_{k}-\boldsymbol{g}_{k-1} \end{aligned}
```



## Monte Carlo Simulation

For triangular mesh (2D), the system energy reads

```math
H= \sum_{\langle i, j\rangle}  \vec{D}_{i j} \cdot\left(\vec{S}_{i} \times \vec{S}_{j}\right)
-J \sum_{\langle i, j\rangle} \vec{S}_{i} \cdot \vec{S}_{j}- \lambda \sum_{\langle i, j\rangle} S_{i}^{z} S_{j}^{z}
-K \sum_{i}\left(S_{i}^{z}\right)^{2}
```

where

```math
\vec{D}_{i j} = D \hat{z} \times \hat{r}_{ij}  + D_z^{j} \hat{z}
```
