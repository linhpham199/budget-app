//BUDGET CONTROLLER
var budgetController = function() {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);      
    } else {
      this.percentage = -1;
    }

    return this.percentage;
  }

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    percentage: 0,
    budget: 0
  }

  var calcTotal = function(type) {
    var sum = 0;

    data.items[type].forEach(function(item) {
      sum += parseFloat(item.value);
    })

    data.totals[type] = sum;
  }

  return {
    newItem: function(item) {
      var newItem, id;

      if (data.items[item.type].length > 0) {
        id = data.items[item.type][data.items[item.type].length - 1].id + 1;
      } else {
        id = 0;
      }
        
      if (item.type === 'inc') {
        newItem = new Income(id, item.description, item.value);
      } else if (item.type === 'exp') {
        newItem = new Expense(id, item.description, item.value);
      }

      data.items[item.type].push(newItem);
      console.log(data);

      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;
      
      ids = data.items[type].map(function(current) {
        return current.id;
      })

      index = ids.indexOf(id);

      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
      
      console.log(ids)
    },

    calcBudget: function() {
      calcTotal('inc');
      calcTotal('exp');

      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100)
      }
      
      return {
        budget: data.budget,
        percentage: data.percentage,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      }
    },

    calcPercentages: function() {
      var percList = data.items.exp.map(function(current) {
        return current.calcPercentage(data.totals.inc);
      })

      console.log(percList);
      return percList;
    }
  }

  
}();

//UI CONTROLLER
var UIController = function() {
  var DOMString;

  DOMStrings = {
    inputType: '.add__type',
    inputDes: '.add__description',
    inputVal: '.add__value',
    btn: '.add__btn',
    incomeList: '.income__list',
    expenseList: '.expenses__list',
    totalIncome: '.budget__income--value',
    totalExpense: '.budget__expenses--value',
    budgetVal: '.budget__value',
    budgetExpPerc: '.budget__expenses--percentage',
    expPerc: '.item__percentage',
    container: '.container',
    date: '.budget__title--month',
  }

  var formatNumber = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' });

  return {
    getInputs: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDes).value,
        value: document.querySelector(DOMStrings.inputVal).value
      }
    },

    displayList: function(item, type) {
      var html, newHtml, container;

      if (type === 'inc') {
        container = DOMStrings.incomeList;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type = 'exp') {
        container = DOMStrings.expenseList;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      
      newHtml = html.replace('%id%', item.id);
      newHtml = newHtml.replace('%des%', item.description);
      newHtml = newHtml.replace('%val%', formatNumber.format(parseFloat(item.value)));

      document.querySelector(container).insertAdjacentHTML("beforeend", newHtml);
      
      
    },

    delelteListItem: function(id) {
      var element = document.getElementById(id);

      element.parentNode.removeChild(element);
    },

    displayBudget: function(obj) {
      document.querySelector(DOMStrings.totalIncome).innerHTML = '+ ' + formatNumber.format(obj.totalInc);
      document.querySelector(DOMStrings.totalExpense).innerHTML = '- ' + formatNumber.format(obj.totalExp); 

      if (obj.budget > 0) {
        document.querySelector(DOMStrings.budgetVal).innerHTML = '+ ' + formatNumber.format(obj.budget);
      } else {
        document.querySelector(DOMStrings.budgetVal).innerHTML = formatNumber.format(obj.budget);
      }
      
      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.budgetExpPerc).innerHTML = obj.percentage + '%'
      } else {
        document.querySelector(DOMStrings.budgetExpPerc).innerHTML = '---'
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMStrings.expPerc);

      fields.forEach(function(current, index) {
        if (percentages[index] > 0) {
          current.innerHTML = percentages[index] + "%";
        } else {
          current.innerHTML = "---";
        }
      })
    },

    clearFields: function() {
      document.querySelector(DOMStrings.inputDes).value = '';
      document.querySelector(DOMStrings.inputVal).value = '';

      document.querySelector(DOMStrings.inputDes).focus();
    },

    displayDate: function() {
      var now, year, month, months;

      now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
      year = now.getFullYear();

      document.querySelector(DOMStrings.date).textContent = months[month] + ' ' + year;
    },

    changeType: function() {
      var fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDes + ',' +
        DOMStrings.inputVal
      );

      fields.forEach(function(current) {
        current.classList.toggle('red-focus')
      })

      document.querySelector(DOMStrings.btn).classList.toggle('red');
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  }
}();

//GLOBAL APP CONTROLLER
var controller = function (budgetCtrl, UICtrl) {

  var setUpEventListener = function() {

    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.btn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (event) => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
  }

  var updateBudget = function() {
    var result = budgetCtrl.calcBudget();

    UICtrl.displayBudget(result)
  }

  var updatePercentages = function () {
    var percList = budgetCtrl.calcPercentages();

    UICtrl.displayPercentages(percList);
  }

  var ctrlAddItem = function() {
    var input = UICtrl.getInputs();
    // console.log(input);
    if (input.description !== '' && input.value !== '' && !isNaN(input.value) && input.value > 0) {
      //Add item to data
      var item = budgetCtrl.newItem(input);

      //Update UI
      UICtrl.displayList(item, input.type);

      //Clear input fields
      UICtrl.clearFields();

      //Calculate budget and update UI
      updateBudget();

      //Update percentages of all the expenses
      updatePercentages();
    }
  }

  var ctrlDeleteItem = function(event) {
    var itemID, ID, type, splitID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
    if (itemID) {
      splitID = itemID.split('-');
      ID = parseInt(splitID[1]);
      type = splitID[0];

      budgetCtrl.deleteItem(type, ID);

      UICtrl.delelteListItem(itemID);

      updateBudget();

      updatePercentages();
    }
  }

  return {
    init: function() {
      setUpEventListener();
      UICtrl.displayDate();
      UICtrl.displayBudget({
        totalExp: 0,
        totalInc: 0,
        budget: 0,
        percentage: -1,
      })
    }
  }

}(budgetController, UIController);

controller.init();