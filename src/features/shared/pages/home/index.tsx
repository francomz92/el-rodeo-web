import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
    const navigate = useNavigate()

    const goTo = () => {
        navigate("/users")
    }
    return (
        <div>
            <h1>Home</h1>
            <button onClick={goTo}>Ir</button>
        </div>
    )
}

export default Home
