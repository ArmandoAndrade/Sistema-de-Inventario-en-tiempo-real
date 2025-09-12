import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import axiosInstance from "../../../api/axiosInstance.js";
import { FormLogInView } from "../components/FormLoginView.jsx";

export const FormLogInContainer = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.post('/login', { email, contraseña: password });
            login(res.data.token, res.data.usuario);
            navigate("/home");
        } catch (error) {
            console.error(error);
            setError('Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormLogInView
            error={error}
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading} 
        />
    );
}

