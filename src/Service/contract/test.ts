import TonWeb from "tonweb";
const tonweb = new TonWeb();

async function getBalance(){
    const balance = await tonweb.getBalance("UQADccqVIu8un2TwQnvwR54SOmxpdljgxnnvkNRH01rt4omz");
    console.log("余额：",balance)
}

getBalance()
