const itemSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true, 
      minlength: 3, 
      maxlength: 100 
    },
    description: { 
      type: String, 
      required: true, 
      minlength: 10, 
      maxlength: 500 
    }
  });
  