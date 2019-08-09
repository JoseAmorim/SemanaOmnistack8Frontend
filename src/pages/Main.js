import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Link } from 'react-router-dom'
import './Main.css'

import logo from '../assets/logo.svg'
import like from '../assets/like.svg'
import dislike from '../assets/dislike.svg'
import itsamatch from '../assets/itsamatch.png'
import api from '../services/api'

export default ({ match }) => {
    const [devs, setDevs] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    useEffect(() => {
        const asyncLoadUsers = async () => {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id
                }
            })

            setDevs(response.data)
        }

        asyncLoadUsers()
    }, [match.params.id])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        })

        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [match.params.id])

    const handleLike = async id => {
        await api.post(`/devs/${id}/likes`, {}, {
            headers: {
                user: match.params.id
            }
        })

        setDevs(devs.filter(item => item._id !== id))
    }

    const handleDislike = async id => {
        await api.post(`/devs/${id}/dislikes`, {}, {
            headers: {
                user: match.params.id
            }
        })

        setDevs(devs.filter(item => item._id !== id))
    }

    const renderDevs = () => (
            <ul>
                {devs.map(item => (
                    <li key={item._id}>
                        <img src={item.avatar} alt={item.user} />
                        <footer>
                            <strong>{item.name}</strong>
                            <p>{item.bio}</p>
                        </footer>

                        <div className="buttons">
                            <button onClick={() => handleDislike(item._id)}
                                type="button">
                                <img src={dislike} alt='Dislike' />
                            </button>
                            <button onClick={() => handleLike(item._id)}
                                type="button">
                                <img src={like} alt='Like' />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )

    const renderMatch = () => (
        <div className="match-container">
            <img src={itsamatch} alt="It's a match" />
            <img className="avatar" src={matchDev.avatar} alt={`${matchDev.name}`} />
            <strong>{matchDev.name}</strong>
            <p>{matchDev.bio}</p>
            <button onClick={() => setMatchDev(null)} type="button">Fechar</button>
        </div>
    )

    return (
        <div className="main-container">
            <Link to='/'>
                <img src={logo} alt="Tindev" />
            </Link>
            {devs.length > 0 ? renderDevs() :
                <div className="empty">Acabou :(</div>
            }
            {matchDev && renderMatch()}
        </div >
    )
}
