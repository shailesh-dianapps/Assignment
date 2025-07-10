class BankAccount{
    constructor(accountNumber, accountHolderName, balance){
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
    }
    deposit(amount){
        this.balance = amount + this.balance;
        console.log("Deposited");
    }
    withdraw(amount){
        if(this.balance < amount) console.log("Eroor: Current balance is ", this.checkBalance());
        else  this.balance = this.balance - amount;
    }
    checkBalance(){
        return this.balance;
    }
}

const account = new BankAccount("65", "Peter", 2000);
account.deposit(500);         
account.withdraw(200);        
console.log(account.checkBalance()); 