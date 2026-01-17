import './App.css'
import { useState } from 'react'


function App() {
  const [item, setItem] = useState('')
  const [fridgeItems, setFridgeItems] = useState([])
  const [profile, setProfile] = useState({
    weightKg: 70,
    heightCm: 170,
    age: 28,
    sex: 'female',
    activityFrequency: '3-4',
    goal: 'recomp',
  })
  const [mealsCount, setMealsCount] = useState(3)
  const [apiResult, setApiResult] = useState(null)
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    setApiError('')
    setApiResult(null)

    if (fridgeItems.length === 0) {
      setApiError('Add at least one ingredient before generating recipes.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          ingredients: fridgeItems.map((name) => ({
            name,
            amount: 1,
            unit: 'item',
          })),
          mealsCount: Number(mealsCount),
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Request failed')
      }

      const data = await response.json()
      setApiResult(data)
    } catch (error) {
      setApiError(error.message || 'Something went wrong.')
  } finally {
      setIsLoading(false)
    }
  }

  const getRecipesFromResponse = () => {
    if (!apiResult) return []
    if (Array.isArray(apiResult.recipes)) return apiResult.recipes
    if (Array.isArray(apiResult.meals)) return apiResult.meals
    const raw = apiResult?.meals?.raw
    if (typeof raw === 'string') {
      try {
        const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        if (Array.isArray(parsed?.meals)) return parsed.meals
      } catch (error) {
        return []
      }
    }
    return []
  }

  const recipesToRender = getRecipesFromResponse()

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img
            src="logo.png"
            width="auto"
            height= "100"
            alt="logo"
          />
        </a>
      </nav>

      <div className="container mt-4">
        <div className="row align-items-center">
          
          {/* Image column */}
          <div className="col-md-6">
            <img
              src="mainpage.png"
              width ="auto"
              height= "700px"
              className="img-fluid"
              alt="mainpage"
            />
          </div>

          {/* Form column */}
          <div className="col-md-6">
            <form
                className="mb-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (item.trim() === '') return
                  setFridgeItems([...fridgeItems, item])
                  setItem('')
                }}
              >

              <div className="mb-5">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  What's in your fridge?
                </label>
                <div className="d-flex">
                <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="one box of pasta"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
              <button className='ml-2'>Add</button>
              </div>
              </div>
            </form>
            <div className="d-flex flex-wrap gap-5">
              {fridgeItems.map((food, index) => (
                <div key={index} className="sticky-note mr-2 mb-2">
                  {food}
                </div>
              ))}
            </div>

            <div className="mt-4 text-start">
              <h5>Profile</h5>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={profile.weightKg}
                    onChange={(e) =>
                      setProfile({ ...profile, weightKg: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Height (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={profile.heightCm}
                    onChange={(e) =>
                      setProfile({ ...profile, heightCm: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({ ...profile, age: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Sex</label>
                  <select
                    className="form-select mt-2 ml-1"
                    value={profile.sex}
                    onChange={(e) =>
                      setProfile({ ...profile, sex: e.target.value })
                    }
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Activity</label>
                  <select
                    className="form-select mt-2 ml-1"
                    value={profile.activityFrequency}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        activityFrequency: e.target.value,
                      })
                    }
                  >
                    <option value="1-2">1-2 / week</option>
                    <option value="3-4">3-4 / week</option>
                    <option value="5-7">5-7 / week</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Goal</label>
                  <select
                    className="form-select ml-1"
                    value={profile.goal}
                    onChange={(e) =>
                      setProfile({ ...profile, goal: e.target.value })
                    }
                  >
                    <option value="cutting">Cutting</option>
                    <option value="recomp">Recomp</option>
                    <option value="bulking">Bulking</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Meals to generate</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    value={mealsCount}
                    onChange={(e) => setMealsCount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-start">
              <button
                onClick={handleGenerate}
                className="btn btn-warning btn-lg mb-3"
                type="button"
                disabled={isLoading}
              >
                {isLoading ? 'Cooking...' : 'Start Cooking'}
              </button>
              {apiError ? (
                <div className="alert alert-danger" role="alert">
                  {apiError}
                </div>
              ) : null}
            </div>
          </div>

        </div>
        {apiResult && recipesToRender.length ? (
          <div className="row g-4 mt-4 justify-content-center">
            {recipesToRender.map((recipe, index) => (
              <div key={index} className="col-12 col-md-4 d-flex justify-content-center">
                <div className="card recipe-card">
                  <div className="content">
                    <div className="back">
                      <div className="back-content recipe-back-content">
                        <img
                          src="logowhite.png"
                          alt="logo"
                          className="recipe-logo"
                        />
                        <strong>{recipe.name}</strong>
                        {recipe.description ? (
                          <p className="recipe-description">
                            {recipe.description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="front">
                      <div className="front-content">
                        <div className="recipe-front-title">{recipe.name}</div>
                        <div className="recipe-meta">
                          <span>
                            Time:{' '}
                            {recipe.timeTakenMinutes
                              ? `${recipe.timeTakenMinutes} min`
                              : 'TBD'}
                          </span>
                          <span>
                            Servings:{' '}
                            {recipe.servings ? recipe.servings : 'TBD'}
                          </span>
                          <span>
                            Calories:{' '}
                            {recipe.estimatedMacros?.calories ?? 'TBD'}
                          </span>
                        </div>
                        <div className="description">
                          {Array.isArray(recipe.steps) && recipe.steps.length ? (
                            <ol className="recipe-steps">
                              {recipe.steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ol>
                          ) : (
                            <p>No steps provided.</p>
                          )}
                          <div className="recipe-macros">
                            <span>
                              Protein:{' '}
                              {recipe.estimatedMacros?.protein_g ?? 0}g
                            </span>
                            <span>
                              Carbs:{' '}
                              {recipe.estimatedMacros?.carbs_g ?? 0}g
                            </span>
                            <span>
                              Fat:{' '}
                              {recipe.estimatedMacros?.fat_g ?? 0}g
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <footer>©2026 Made by <a href="https://github.com/Brendan-Lim">Brendan</a> & <a href="https://github.com/Matthiaschanjk">Matthias</a></footer>
    </>

    
  )
}

export default App
