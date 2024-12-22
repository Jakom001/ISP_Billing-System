let balance = 0;

let connected = false;
const price = 1000;
const connectedDate = new Date();


const userTopUp = (amount) =>{
    balance += amount;
    return balance;
}

// Function to connect the user to the internet

const userConnect = () =>{
    connectedDate.setDate(connectedDate.getDate() + 1); // Set the expiry date to one day from now
    if(balance >= price){
        balance -= price;
        connected = true;
        return connected, balance;
    }
    else if((balance > 0) && (balance < price)){
        return `Please top up ${price - balance} to connect`;
    }
    return "Please top up to connect";
}

// Function to disconnect the user from the internet

const userDisconnect = () =>{
    connected = false;
    return connected;
}


// Test the functions
const main = () =>{
    balance = userTopUp(0);
    
    connected, balance = userConnect();
    
    console.log(balance);
    console.log(connected);
}


main();


