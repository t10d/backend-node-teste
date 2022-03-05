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
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthOk"
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
                  "$ref": "#/components/schemas/InvalidMissingParamError"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthOk"
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
                  "$ref": "#/components/schemas/MissingParamError"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
                "$ref": "#/components/schemas/AddBudgetRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BudgetModel"
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
                  "$ref": "#/components/schemas/MissingParamError"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
            "headers": {}
          },
          "404": {
            "description": "Not Found",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFound"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ExpenseModel"
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
                  "$ref": "#/components/schemas/MissingParamError"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ExpenseModel"
                  }
                },
                "example": [
                  {
                    "id": "expense_id",
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
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MissingParamError"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ExpenseModel"
                }
              }
            }
          },
          "404": {
            "description": "Not Found",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFound"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/InviteModel"
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MissingParamError"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MissingParamError"
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
            "description": "OK",
            "headers": {}
          },
          "404": {
            "description": "Not Found",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFound"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MissingParamError"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/invite_status/{id}": {
      "patch": {
        "tags": [
          "Invite"
        ],
        "summary": "Update Invite Status",
        "operationId": "UpdateInviteStatus",
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
                "type": "object",
                "example": {
                  "status": "approved"
                }
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "headers": {}
          },
          "404": {
            "description": "Not Found",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NotFound"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
                }
              }
            }
          }
        },
        "deprecated": false
      }
    },
    "/invites": {
      "get": {
        "tags": [
          "Invite"
        ],
        "summary": "Get Invites",
        "operationId": "GetInvites",
        "parameters": [
          {
            "name": "toMe",
            "in": "query",
            "description": "",
            "required": false,
            "style": "form",
            "explode": true,
            "schema": {
              "type": "boolean",
              "example": false
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
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/InviteModel"
                  }
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
                  "$ref": "#/components/schemas/MissingParamError"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ServerError"
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
      "ExpenseModel": {
        "title": "ExpenseModel",
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
          "id": "expense_id",
          "name": "expense_name",
          "category": "expense_category",
          "realized": 42,
          "projected": 420,
          "type": "type",
          "budgetId": "budget_id"
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
      "SendInviteRequest": {
        "title": "SendInviteRequest",
        "required": [
          "description",
          "to",
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
          "budgetId": {
            "type": "string"
          }
        },
        "example": {
          "description": "invite_desc",
          "to": "to_user_id",
          "budgetId": "budget_id"
        }
      },
      "MissingParamError": {
        "title": "MissingParamError",
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
          "error": "Missing param: param"
        }
      },
      "BudgetModel": {
        "title": "BudgetModel",
        "required": [
          "id",
          "name",
          "totalRealized",
          "totalProjected",
          "expenses",
          "userId"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
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
          },
          "expenses": {
            "type": "array",
            "items": {
              "type": "object"
            },
            "description": ""
          },
          "userId": {
            "type": "string"
          }
        },
        "description": "",
        "example": {
          "id": "budget_id",
          "name": "budget_name",
          "totalRealized": 420,
          "totalProjected": 4200,
          "expenses": [],
          "userId": "user_id"
        }
      },
      "InviteModel": {
        "title": "InviteModel",
        "required": [
          "id",
          "description",
          "userId",
          "to",
          "date",
          "budgetId",
          "status"
        ],
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "userId": {
            "type": "string"
          },
          "to": {
            "type": "string"
          },
          "date": {
            "type": "string",
            "format": "date-time"
          },
          "budgetId": {
            "type": "string"
          },
          "status": {
            "type": "string"
          }
        },
        "description": "",
        "example": {
          "id": "invite_id",
          "description": "invite_desc",
          "userId": "from_user_id",
          "to": "to_user_id",
          "date": "2012-04-23T18:25:43.511Z",
          "budgetId": "budget_id",
          "status": "any_status"
        }
      },
      "ServerError": {
        "title": "ServerError",
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
      "NotFound": {
        "title": "NotFoundError",
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
      "InvalidMissingParamError": {
        "title": "InvalidMissingParamError",
        "type": "object",
        "description": "This errors retuning the same error code, but your returns values are differents",
        "example": {
          "error": "Invalid/Missing param: param"
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