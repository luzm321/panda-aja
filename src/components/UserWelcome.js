import "./UserWelcome.css";


export const UserWelcome = ({ userName }) => {

    return (
        <>
          <h3 class="greeting">Welcome, {userName}!</h3>
        </>
    );
};