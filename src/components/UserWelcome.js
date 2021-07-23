import "./UserWelcome.css";


export const UserWelcome = ({ userName }) => {

    return (
        <>
          <h3 className="greeting">Welcome, {userName}!</h3>
        </>
    );
};