from graphviz import Digraph

g = Digraph('G', filename='driver_graph')

g.node("Driver")
g.node("LLG", shape="box")
g.node("LLG_STT", shape="box")
g.node("EnergyMinimization", shape="box")
g.edge('Driver', 'LLG')
g.edge('Driver', 'LLG_STT')
g.edge('Driver', 'EnergyMinimization')

g.node("DriverGPU")
g.node("EnergyMinimization_GPU", shape="box")
g.node("LLG_GPU", shape="box")
g.node("LLG_STT_GPU", shape="box")
g.node("LLG_STT_CPP_GPU", shape="box")
g.edge('DriverGPU', 'LLG_GPU')
g.edge('DriverGPU', 'LLG_STT_GPU')
g.edge('DriverGPU', 'LLG_STT_CPP_GPU')
g.edge('DriverGPU', 'EnergyMinimization_GPU')


#g.node("NEBDriver")
#g.node("NEB_LLG_Driver", shape="box")
#g.node("NEB_SD", shape="box")
#g.edge('NEBDriver', 'NEB_SD')
#g.edge('NEBDriver', 'NEB_LLG_Driver')

g.render(view=True)
