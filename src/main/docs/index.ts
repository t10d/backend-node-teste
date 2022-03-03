export default {
  "openapi": "3.0.0",
  "info": {
    "title": "NodeJS Budget Manager API",
    "contact": {
      
    },
    "version": "1.0"
  },
  "servers": [
    {
      "url": "https://localhost:6060/api",
      "variables": {
        
      }
    }
  ],
  "paths": {
    "/signup": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "SignUp",
        "operationId": "SignUp",
        "parameters": [
          
        ],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SignUpRequest"
              },
              "example": {
                "name": "any_user",
                "email": "email@email.com",
                "password": "any_password",
                "passwordConfirmation": "any_password"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUpOk"
                },
                "example": {
                  "accessToken": "ACCESS_TOKEN"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUpInvalidParam1"
                },
                "example": {
                  "error": "Invalid param: password"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError1"
                },
                "example": {
                  "error": "Internal Server Error"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/auth": {
      "post": {
        "tags": [
          "Authentication"
        ],
        "summary": "Auth",
        "operationId": "Auth",
        "parameters": [
          {
            "name": "x-access-token",
            "in": "header",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "<ACCESS_TOKEN>"
            }
          }
        ],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AuthRequest"
              },
              "example": {
                "email": "email@email.com",
                "password": "any_password"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthOk"
                },
                "example": {
                  "accessToken": "ACCESS_TOKEN"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthMissingParam1"
                },
                "example": {
                  "error": "Missing param: password"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError1"
                },
                "example": {
                  "error": "Internal Server Error"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/budget": {
      "post": {
        "tags": [
          "Budget"
        ],
        "summary": "Add Budget",
        "operationId": "AddBudget",
        "parameters": [
          {
            "name": "x-access-token",
            "in": "query",
            "description": "",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "<ACCESS_TOKEN>"
            }
          }
        ],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AddBudgetRequest"
              },
              "example": {
                "name": "budget_name",
                "totalRealized": 42,
                "totalProjected": 420
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              
            },
            "content": {
              
            }
          },
          "400": {
            "description": "Bad Request",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddBudgetMissingParam1"
                },
                "example": {
                  "error": "Missing param: totalRealized"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddBudgetServerError1"
                },
                "example": {
                  "error": "Internal error"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/budget/{id}": {
      "delete": {
        "tags": [
          "Budget"
        ],
        "summary": "Delete Budget",
        "operationId": "DeleteBudget",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "null"
            }
          },
          {
            "name": "x-access-token",
            "in": "header",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "<ACCESS_TOKEN>"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeleteBudgetOk"
                },
                "example": {
                  "id": "budget_id"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeleteBudgetNotFound1"
                },
                "example": {
                  "error": "Resource not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeleteBudgetServerError1"
                },
                "example": {
                  "error": "Internal error"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/expense": {
      "post": {
        "tags": [
          "Expense"
        ],
        "summary": "Add Expense",
        "operationId": "AddExpense",
        "parameters": [
          {
            "name": "x-access-token",
            "in": "header",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "<ACCESS_TOKEN>"
            }
          }
        ],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AddExpenseRequest"
              },
              "example": {
                "name": "expense_name",
                "category": "expense_category",
                "realized": 42,
                "projected": 420,
                "type": "type",
                "budgetId": "budget_id"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddExpenseOk"
                },
                "example": {
                  "id": "expesne_id",
                  "name": "expense_name",
                  "category": "expense_category",
                  "realized": 42,
                  "projected": 420,
                  "type": "type",
                  "budgetId": "budget_id"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddExpenseMissingParam1"
                },
                "example": {
                  "error": "Missing param: projected"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddExpenseServerError1"
                },
                "example": {
                  "error": "Internal error"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/expenses": {
      "get": {
        "tags": [
          "Expense"
        ],
        "summary": "Get Expenses by Budget",
        "operationId": "GetExpensesbyBudget",
        "parameters": [
          {
            "name": "budgetId",
            "in": "query",
            "description": "",
            "required": true,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "string",
              "example": "budget_id"
            }
          },
          {
            "name": "x-access-token",
            "in": "header",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "ACCESS_TOKEN"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/GetExpensesbyBudgetOk"
                  },
                  "description": "",
                  "example": [
                    {
                      "id": "expesne_id",
                      "name": "expense_name",
                      "category": "expense_category",
                      "realized": 42,
                      "projected": 420,
                      "type": "type",
                      "budgetId": "budget_id"
                    }
                  ]
                },
                "example": [
                  {
                    "id": "expesne_id",
                    "name": "expense_name",
                    "category": "expense_category",
                    "realized": 42,
                    "projected": 420,
                    "type": "type",
                    "budgetId": "budget_id"
                  }
                ]
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetExpensesbyBudgetMissinsParam1"
                },
                "example": {
                  "error": "Missing param: budgetId"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/GetExpensesbyBudgetServerError1"
                },
                "example": {
                  "error": "Internal error"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/expense/{id}": {
      "put": {
        "tags": [
          "Expense"
        ],
        "summary": "Update Expense",
        "operationId": "UpdateExpense",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "null"
            }
          },
          {
            "name": "x-access-token",
            "in": "header",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "<ACCESS_TOKEN>"
            }
          }
        ],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateExpenseRequest"
              },
              "example": {
                "name": "expense_name",
                "category": "food",
                "realized": 420,
                "projected": 500,
                "type": "variable",
                "budgetId": "budget_id"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateExpenseOk"
                },
                "example": {
                  "name": "expense_name",
                  "category": "food",
                  "realized": 420,
                  "projected": 500,
                  "type": "variable",
                  "budgetId": "budget_id"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateExpenseNotFound1"
                },
                "example": {
                  "error": "Resource not found"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {
              
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateExpenseServerError1"
                },
                "example": {
                  "error": "Internal error"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/invite": {
      "post": {
        "tags": [
          "Invite"
        ],
        "summary": "Send Invite",
        "operationId": "SendInvite",
        "parameters": [
          {
            "name": "x-access-token",
            "in": "header",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "<ACCESS_TOKEN>"
            }
          }
        ],
        "requestBody": {
          "description": "",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SendInviteRequest"
              },
              "example": {
                "description": "invite_desc",
                "to": "to_user_id",
                "date": "date",
                "budgetId": "budget_id"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "",
            "headers": {
              
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUpInvalidParam1"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUpInvalidParam1"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/invite/{id}": {
      "delete": {
        "tags": [
          "Invite"
        ],
        "summary": "Delete Invite",
        "operationId": "DeleteInvite",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "null"
            }
          },
          {
            "name": "x-access-token",
            "in": "header",
            "description": "",
            "required": true,
            "style": "simple",
            "schema": {
              "type": "string",
              "example": "<ACCESS_TOKEN>"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "headers": {
              
            }
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUpInvalidParam1"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignUpInvalidParam1"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    }
  },
  "components": {
    "schemas": {
      "SignUpRequest": {
        "title": "SignUpRequest",
        "required": [
          "name",
          "email",
          "password",
          "passwordConfirmation"
        ],
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "passwordConfirmation": {
            "type": "string"
          }
        },
        "example": {
          "name": "any_user",
          "email": "email@email.com",
          "password": "any_password",
          "passwordConfirmation": "any_password"
        }
      },
      "SignUpOk": {
        "title": "SignUpOk",
        "required": [
          "accessToken"
        ],
        "type": "object",
        "properties": {
          "accessToken": {
            "type": "string"
          }
        },
        "example": {
          "accessToken": "ACCESS_TOKEN"
        }
      },
      "SignUpInvalidParam1": {
        "title": "SignUpInvalidParam1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Invalid param: password"
        }
      },
      "SignUpMissingParam1": {
        "title": "SignUpMissingParam1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Missing param: name"
        }
      },
      "ServerError1": {
        "title": "ServerError1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Internal Server Error"
        }
      },
      "AuthRequest": {
        "title": "AuthRequest",
        "required": [
          "email",
          "password"
        ],
        "type": "object",
        "properties": {
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        },
        "example": {
          "email": "email@email.com",
          "password": "any_password"
        }
      },
      "AuthOk": {
        "title": "AuthOk",
        "required": [
          "accessToken"
        ],
        "type": "object",
        "properties": {
          "accessToken": {
            "type": "string"
          }
        },
        "example": {
          "accessToken": "ACCESS_TOKEN"
        }
      },
      "AuthMissingParam1": {
        "title": "AuthMissingParam1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Missing param: password"
        }
      },
      "AddBudgetRequest": {
        "title": "AddBudgetRequest",
        "required": [
          "name",
          "totalRealized",
          "totalProjected"
        ],
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "totalRealized": {
            "type": "integer",
            "format": "int32"
          },
          "totalProjected": {
            "type": "integer",
            "format": "int32"
          }
        },
        "example": {
          "name": "budget_name",
          "totalRealized": 42,
          "totalProjected": 420
        }
      },
      "AddBudgetMissingParam1": {
        "title": "AddBudgetMissingParam1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Missing param: totalRealized"
        }
      },
      "AddBudgetServerError1": {
        "title": "AddBudgetServerError1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Internal error"
        }
      },
      "DeleteBudgetOk": {
        "title": "DeleteBudgetOk",
        "required": [
          "id"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        },
        "example": {
          "id": "budget_id"
        }
      },
      "DeleteBudgetNotFound1": {
        "title": "DeleteBudgetNotFound1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Resource not found"
        }
      },
      "DeleteBudgetServerError1": {
        "title": "DeleteBudgetServerError1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Internal error"
        }
      },
      "AddExpenseRequest": {
        "title": "AddExpenseRequest",
        "required": [
          "name",
          "category",
          "realized",
          "projected",
          "type",
          "budgetId"
        ],
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "realized": {
            "type": "integer",
            "format": "int32"
          },
          "projected": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "budgetId": {
            "type": "string"
          }
        },
        "example": {
          "name": "expense_name",
          "category": "expense_category",
          "realized": 42,
          "projected": 420,
          "type": "type",
          "budgetId": "budget_id"
        }
      },
      "AddExpenseOk": {
        "title": "AddExpenseOk",
        "required": [
          "id",
          "name",
          "category",
          "realized",
          "projected",
          "type",
          "budgetId"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "realized": {
            "type": "integer",
            "format": "int32"
          },
          "projected": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "budgetId": {
            "type": "string"
          }
        },
        "example": {
          "id": "expesne_id",
          "name": "expense_name",
          "category": "expense_category",
          "realized": 42,
          "projected": 420,
          "type": "type",
          "budgetId": "budget_id"
        }
      },
      "AddExpenseMissingParam1": {
        "title": "AddExpenseMissingParam1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Missing param: projected"
        }
      },
      "AddExpenseServerError1": {
        "title": "AddExpenseServerError1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Internal error"
        }
      },
      "GetExpensesbyBudgetOk": {
        "title": "GetExpensesbyBudgetOk",
        "required": [
          "id",
          "name",
          "category",
          "realized",
          "projected",
          "type",
          "budgetId"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "realized": {
            "type": "integer",
            "format": "int32"
          },
          "projected": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "budgetId": {
            "type": "string"
          }
        },
        "example": {
          "id": "expesne_id",
          "name": "expense_name",
          "category": "expense_category",
          "realized": 42,
          "projected": 420,
          "type": "type",
          "budgetId": "budget_id"
        }
      },
      "GetExpensesbyBudgetMissinsParam1": {
        "title": "GetExpensesbyBudgetMissinsParam1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Missing param: budgetId"
        }
      },
      "GetExpensesbyBudgetServerError1": {
        "title": "GetExpensesbyBudgetServerError1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Internal error"
        }
      },
      "UpdateExpenseRequest": {
        "title": "UpdateExpenseRequest",
        "required": [
          "name",
          "category",
          "realized",
          "projected",
          "type",
          "budgetId"
        ],
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "realized": {
            "type": "integer",
            "format": "int32"
          },
          "projected": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "budgetId": {
            "type": "string"
          }
        },
        "example": {
          "name": "expense_name",
          "category": "food",
          "realized": 420,
          "projected": 500,
          "type": "variable",
          "budgetId": "budget_id"
        }
      },
      "UpdateExpenseOk": {
        "title": "UpdateExpenseOk",
        "required": [
          "name",
          "category",
          "realized",
          "projected",
          "type",
          "budgetId"
        ],
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "category": {
            "type": "string"
          },
          "realized": {
            "type": "integer",
            "format": "int32"
          },
          "projected": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "budgetId": {
            "type": "string"
          }
        },
        "example": {
          "name": "expense_name",
          "category": "food",
          "realized": 420,
          "projected": 500,
          "type": "variable",
          "budgetId": "budget_id"
        }
      },
      "UpdateExpenseNotFound1": {
        "title": "UpdateExpenseNotFound1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Resource not found"
        }
      },
      "UpdateExpenseServerError1": {
        "title": "UpdateExpenseServerError1",
        "required": [
          "error"
        ],
        "type": "object",
        "properties": {
          "error": {
            "type": "string"
          }
        },
        "example": {
          "error": "Internal error"
        }
      },
      "SendInviteRequest": {
        "title": "SendInviteRequest",
        "required": [
          "description",
          "to",
          "date",
          "budgetId"
        ],
        "type": "object",
        "properties": {
          "description": {
            "type": "string"
          },
          "to": {
            "type": "string"
          },
          "date": {
            "type": "string"
          },
          "budgetId": {
            "type": "string"
          }
        },
        "example": {
          "description": "invite_desc",
          "to": "to_user_id",
          "date": "date",
          "budgetId": "budget_id"
        }
      }
    }
  },
  "tags": [
    {
      "name": "Authentication"
    },
    {
      "name": "Budget"
    },
    {
      "name": "Expense"
    },
    {
      "name": "Invite"
    }
  ]
}