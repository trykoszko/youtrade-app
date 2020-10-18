import React, { useState, useEffect } from 'react'
import {
  Grid,
  Row,
  Column,
  Button,
  Tabs,
  Tab
} from 'carbon-components-react'
import Cookies from 'universal-cookie'
import AdTable from './components/AdTable'
import AddForm from './components/AddForm'
import LoginForm from './components/LoginForm'
import './App.scss'
import getElementVal from './helpers/getElementVal'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [formError, setFormError] = useState(null)
  const API_URL = process.env.REACT_APP_API_URL

  const cookies = new Cookies()

  useEffect(() => {
    const apiToken = cookies.get('apiToken')
    if (apiToken) {
      setToken(apiToken)
      setIsLoggedIn(true)
    }
  }, [cookies])

  const handleLoginFormSubmit = e => {
    e.preventDefault()
    const elements = e.currentTarget.elements
    const username = getElementVal(elements, 'username')
    const password = getElementVal(elements, 'password')

    fetch(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
        .then(res => res.json())
        .then(
            res => {
              if (res.success) {
                setToken(res.token)
                setIsLoggedIn(true)
                setFormError(null)
                cookies.set('apiToken', res.token, {
                  path: '/'
                })
              } else {
                setFormError(res.explanation)
              }
            },
            error => {
              console.log('error', error)
            }
        )
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <Grid className="app-grid">
          <Row>
            <Column>
              <h1 className="site-title">
                Hello!
              </h1>
              <p className="site-desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla feugiat ligula id ex varius, sed faucibus tortor ultricies.
              </p>
              <Button href="#">
                This button does nothing!
              </Button>
            </Column>
          </Row>
          <Row className="tables">
            <Column>
              <div className={'container-tabs-story-wrapper--light'}>
                <Tabs type="container">
                  <Tab id="tab-1" label="All ads">
                    <AdTable token={token} endpoint="/ads" disallowEdit={true} />
                  </Tab>
                  <Tab id="tab-2" label="My ads">
                    <AdTable token={token} endpoint="/ads/my" />
                  </Tab>
                  <Tab id="tab-3" label="Add an ad">
                    <AddForm token={token} />
                  </Tab>
                </Tabs>
              </div>
            </Column>
          </Row>
        </Grid>
      ) : (
        <Grid className="app-grid">
          <Row>
            <Column>
              <h4 style={{ marginBottom: '20px' }}>Please log in first</h4>
              {formError ? <div style={{ backgroundColor: isLoggedIn ? 'green' : 'red', padding: '10px', marginBottom: '20px' }}>{formError}</div> : null}
              <LoginForm onFormSubmit={e => handleLoginFormSubmit(e)} />
            </Column>
          </Row>
        </Grid>
      )}
    </div>
  )
}

export default App
