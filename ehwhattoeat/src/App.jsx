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
              {apiResult ? (
                <pre className="bg-light p-3 rounded">
                  {JSON.stringify(apiResult, null, 2)}
                </pre>
              ) : null}
            </div>
          </div>

        </div>
      </div>
<div className="d-flex justify-content-center">
  <div className="card">
    <div className="content">
      <div className="back">
        <div className="back-content">
          <img src="logowhite.png" alt="logo" width="auto" height="200px"/>
          <strong>Hover Me</strong>
        </div>
      </div>

      <div className="front">
        <div className="img">
          <div className="circle" />
          <div className="circle" id="right" />
          <div className="circle" id="bottom" />
        </div>

        <div className="front-content">
          <small className="badge">Pasta</small>

          <div className="description">
            <div className="title">
              <p className="title">
                <strong>Spaghetti Bolognese</strong>
              </p>

              <svg
                fillRule="nonzero"
                height={15}
                width={15}
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g
                  style={{ mixBlendMode: 'normal' }}
                  textAnchor="none"
                  fontSize="none"
                  fontWeight="none"
                  fontFamily="none"
                  strokeDashoffset={0}
                  strokeDasharray=""
                  strokeMiterlimit={10}
                  strokeLinejoin="miter"
                  strokeLinecap="butt"
                  strokeWidth={1}
                  stroke="none"
                  fillRule="nonzero"
                  fill="#20c997"
                >
                  <g transform="scale(8,8)">
                    <path d="M25,27l-9,-6.75l-9,6.75v-23h18z" />
                  </g>
                </g>
              </svg>
            </div>

            <p className="card-footer">
              30 Mins &nbsp; | &nbsp; 1 Serving
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</div>
    </>

    
  )
}

export default App
