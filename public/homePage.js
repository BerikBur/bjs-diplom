//implementing logout button action
const logoutButton = new LogoutButton;
logoutButton.action = function() {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        } else {
            console.error("Ошибка при деавторизации: ", response.error);
        }
    });
}

//getting user's profile data 
function showCurrentProfile() {
    ApiConnector.current((response) => {
    localStorage.setItem('profileResponse', JSON.stringify(response));
        if(response.success) {
            ProfileWidget.showProfile(response.data);
        } else {
            console.log('Error: response is false')
        };
    });
};
showCurrentProfile();

//getting actual rates
//and refreshing dates
const currentRates = new RatesBoard;
function getRates() {
    ApiConnector.getStocks((response) => {
        if(response.success) {
            this.clearTable();
            this.fillTable(response.data);
        }
    });
};
currentRates.getRates = getRates;
currentRates.getRates();
setInterval(currentRates.getRates.bind(currentRates), 1000 * 60);

//money manager
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, async (response) => {
        console.log(response); //to check that response is received
        if(response.success) {
            this.setMessage(true, 'Money added to the balance');
            ProfileWidget.showProfile(response.data);
        } else {
            this.setMessage(false, response.error);
        };
    });  
};


//conversation money
moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, (response) => {
        if(response.success) {
            this.setMessage(true, 'Money is converted');
            ProfileWidget.showProfile(response.data);
        } else {
            this.setMessage(false, response.error);
        };
    });
};

//transfer money
moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, (response) => {
        if(response.success) {
            this.setMessage(true, 'Money was transfered');
            ProfileWidget.showProfile(response.data);
        } else {
            this.setMessage(false, response.error);
        };
    });
};

//
const favoriteUsers = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
    if(response.success) {
        favoriteUsers.clearTable();
        favoriteUsers.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    };
});

//add user to favorites
//data is { id, name }
favoriteUsers.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, (response) => {
        if(response.success) {
            favoriteUsers.clearTable();
            favoriteUsers.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            this.setMessage(true, 'User added to favorites');
        } else {
            this.setMessage(false, response.error);
        };
    });
};

//delete user from favorites
favoriteUsers.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if(response.success) {
            favoriteUsers.clearTable();
            favoriteUsers.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            this.setMessage(true, 'User removed from favorites');
        } else {
            this.setMessage(false, response.error);
        };
    })
}
