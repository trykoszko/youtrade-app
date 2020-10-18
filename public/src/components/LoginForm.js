import React, { useState } from 'react'
import {
    Form,
    TextInput,
    Button
  } from 'carbon-components-react'

export default function LoginForm({ onFormSubmit }) {
    return (
        <Form onSubmit={e => onFormSubmit(e)}>
            <TextInput
                id="username"
                placeholder="Username"
                name="username"
                labelText="Username"
                style={{ marginBottom: '20px' }}
            />
            <TextInput
                id="password"
                placeholder="Password"
                name="password"
                labelText="Password"
                style={{ marginBottom: '20px' }}
            />
            <Button id="submit" label="Log in" value={50} type="submit">
                Log in
            </Button>
        </Form>
    )
}
