using Documenter
using JuMag

makedocs(
    sitename = "JuMag.jl",
    format = Documenter.HTML(
        #prettyurls = get(ENV, "CI", nothing) == "true"
        prettyurls = true
    ),
    modules = [JuMag],
    pages = Any[
        "index.md",
        "tutorial.md",
        "equations.md",
        "notes.md",
        "functions.md",
        #"Examples" => ["examples/std4.md", "examples/SW.md"]
        ],
    highlightsig = true
)

deploydocs(
    #deps = Deps.pip("pygments", "mkdocs", "python-markdown-math"),
    repo = "github.com/ww1g11/JuMagDocs.jl"
)
