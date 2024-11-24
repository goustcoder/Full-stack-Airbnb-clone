class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message
    }
}

module.exports = ExpressError;
// // In JavaScript, the super keyword is used to call the constructor of a parent class. When you extend a class, as in your example with ExpressError extending the built -in Error class, calling super() is necessary to set up the inheritance correctly.It ensures the parent class (Error) is initialized before adding any new properties or methods.

// //     Here's a breakdown of what super does in this context:

// super() in constructor: When super() is called, it runs the constructor of the Error class. This initializes the instance as an Error object, allowing ExpressError to inherit Error's properties and methods, like message and stack.

// Inheritance Setup: super() allows ExpressError to inherit essential properties and methods from Error. If you skip super() in the constructor of a class that extends another, JavaScript will throw an error because it’s required for proper inheritance.

// Accessing Parent Properties: After calling super(), you can add additional properties like statusCode and message, which are specific to your custom error class.