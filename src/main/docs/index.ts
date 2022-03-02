export default {
  "openapi": "3.0.0",
  "info": {
    "title": "NodeJS Budget Manager API",
    "contact": {},
    "version": "1.0"
  },
  "servers": [
    {
      "url": "http://localhost:6060/api",
      "variables": {}
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
        "parameters": [],
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
          "default": {
            "description": "",
            "headers": {},
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
            "headers": {},
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
              "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImlTb1VQdnBuYTVUNXRpbmRYaExnIiwiaWF0IjoxNjQ2MTk0ODg0fQ.Uxe-sNzxTmS4iMACfaK-8t_ZBMcGjg2TyoDffde14Os"
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
          "default": {
            "description": "",
            "headers": {},
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
        "parameters": [],
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
          "400": {
            "description": "Bad Request",
            "headers": {},
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
          "default": {
            "description": "",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddBudgetServerError"
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
    "/budget/budget_id": {
      "delete": {
        "tags": [
          "Budget"
        ],
        "summary": "Delete Budget",
        "operationId": "DeleteBudget",
        "parameters": [],
        "responses": {
          "default": {
            "description": "",
            "headers": {},
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
        "parameters": [],
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
          "default": {
            "description": "",
            "headers": {},
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
          "default": {
            "description": "",
            "headers": {},
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
      "SignUpServerError": {
        "title": "SignUpServerError",
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
      "AuthMissingParam": {
        "title": "AuthMissingParam",
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
      "AuthServerError": {
        "title": "AuthServerError",
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
      "AddBudgetServerError": {
        "title": "AddBudgetServerError",
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
      "DeleteBudgetNotFound": {
        "title": "DeleteBudgetNotFound",
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
      "DeleteBudgetServerError": {
        "title": "DeleteBudgetServerError",
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
      "AddExpenseMissingParam": {
        "title": "AddExpenseMissingParam",
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
      "AddExpenseServerError": {
        "title": "AddExpenseServerError",
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
      "GetExpensesbyBudgetMissinsParam": {
        "title": "GetExpensesbyBudgetMissinsParam",
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
      "GetExpensesbyBudgetServerError": {
        "title": "GetExpensesbyBudgetServerError",
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
    }
  ]
}