import { useNavigate } from 'react-router-dom';

const SmileyPage = () => {
    const navigator = useNavigate();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
            }}
        >
            <div style={{ fontSize: '300px' }}>😊</div>
            <div style={{flexDirection: 'column'}}>
                <h2 style={{color:'yellow'}}>Great job! You submitted the exact solution!</h2>
                <button style={{
                    padding: '10px 20px',
                    fontSize: '20px',
                    backgroundColor: 'lightyellow',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }} onClick={() => navigator('/')}>Back to Lobby</button>
            </div>            
        </div>
    );
};

export default SmileyPage;
