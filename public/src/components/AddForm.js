import React, { useState, useEffect, useRef } from 'react'
import {
    Form,
    TextInput,
    NumberInput,
    TextArea,
    Button
  } from 'carbon-components-react'

import getElementVal from '../helpers/getElementVal'

export default function AddForm({ token }) {
    const [res, setRes] = useState('')
    const API_URL = process.env.REACT_APP_API_URL

    const headers = new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    })

    const handleFormSubmit = async e => {
        e.preventDefault()
        const elements = e.currentTarget.elements
        const title = getElementVal(elements, 'title')
        const desc = getElementVal(elements, 'desc')
        const price = getElementVal(elements, 'price')

        fetch(`${API_URL}/ads`, {
            headers,
            method: 'POST',
            body: JSON.stringify({
                title,
                desc,
                price
            })
        })
            .then(res => res.json())
            .then(
                result => {
                    setRes(result)
                },
                error => {
                    setRes(error)
                }
            )
    }

    return (
        <>
            {res ? <div style={{ backgroundColor: res.success ? 'green' : 'red', padding: '10px', marginBottom: '30px' }}>{res.explanation}</div> : null}
            {res && res.success ? <h4>confirmation_thanks</h4> : (
                <Form onSubmit={e => handleFormSubmit(e)}>
                    <TextInput id="title" placeholder="Title" name="title" labelText="Title" style={{ marginBottom: '20px' }} />
                    <TextArea id="desc" placeholder="Description" name="desc" labelText="Description" style={{ marginBottom: '20px' }} />
                    <NumberInput id="price" placeholder="Price" name="price" label="Price" style={{ marginBottom: '20px' }} />
                    <Button id="submit" label="Price" value={50} type="submit">
                        Add an ad
                    </Button>
                </Form>
            )}
        </>
    )
}
