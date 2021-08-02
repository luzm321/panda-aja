import "./UserWelcome.css";


export const UserWelcome = ({ userName }) => {

    return (
        <>
          <div className="greetingDiv">
            <h3 className="greeting">Welcome, {userName}!</h3>
          </div>
        </>
    );
};