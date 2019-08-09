import React, { useState } from 'react'
import './Login.css'
import logo from '../assets/logo.svg'
import api from '../services/api'

export default function Login({ history }) {
    let [username, setUsername] = useState('')

    const handleSubmit = async event => {
        event.preventDefault()

        const response = await api.post('/devs', {
            username
        })

        const { _id } = response.data

        history.push(`/dev/${_id}`)
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    placeholder="Digite seu usuário no github" />
                <button type="submit">Entrar</button>
            </form>
        </div>
    )
}