import {Navigate, Route, Routes} from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ManagePage from './pages/ManagePage'

/*function RequireAdmin({ children }) {
    return sessionStorage.getItem('patient-admin') === "true" ? children : <Navigate to="/login" replace/>
}*/

/*const handleClick = () => {console.log("is click event !!")}
const MyButton = ({children}) => <button onClick={handleClick}>{children}</button>

const MyForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit');
    };

    const handleChangeText = (e) => {
        console.log(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="請輸入內容" onChange={handleChangeText} />
            <MyButton>提交</MyButton>
            <hr/>
        </form>
    )
}*/
function RequireAdmin( {children} ) {
    return sessionStorage.getItem('patient-admin') === 'true' ? children : <Navigate to='/login' replace/>
}
function App() {
    return (
    <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/manage' element={<RequireAdmin><ManagePage /></RequireAdmin>}/>
        <Route path='*' element={<Navigate to='/' replace />}/>
    </Routes>)
    
}
export default App