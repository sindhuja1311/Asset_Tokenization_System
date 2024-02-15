const mongoose = require('mongoose');

const sellSchema=new mongoose.Schema({
  sell_percentage: {
    type: Number,
    default: null,
    required: true,
  },
  token_available_count:{
    type:Number,
    default:null,
    required:true,
  },
});
const requestSchema = new mongoose.Schema({
   value_type_count:{
    type:Number,
    required:true,
    default:0,
   },
   liquid_type_count:{
    type:Number,
    required:true,
    default:0,
   },
    buyer_name: {
      type: String,
      required: true,
    },
    account_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    metamask_id: {
      type: String,
      required: true,
    },
    response_status:{
      type:String,
      default:null,
      required:true,
    },
});

const ownerSchema = new mongoose.Schema({
  owner_name: {
    type: String,
    required: true,
  },
  account_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  metamask_id: {
    type: String,
    required: true,
  },
  percentage: {
    type: Number,
    default: 100,
    required: true,
  },
  status: {
    type: String,
    default: "owned",
    required: true,
  },
  
  total_tokens: {
    type: Number,
    default: 1000,
    required: true,
  },
  vt_count: {
    type: Number,
    default: 500,
    required: true,
  },
  lt_count: {
    type: Number,
    default: 500,
    required: true,
  },
  vt_value: {
    type: Number,
    default: 1,
    required: true,
  },
  lt_value: {
    type: Number,
    default: 1,
    required: true,
  },
  selling_details:sellSchema,
  request_details: {
    type: [requestSchema],
    required: true,
  },
});

const propertySchema = new mongoose.Schema({
  unique_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  owner_details: {
    type: [ownerSchema],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
  images: [{
    filename: String,
    path: String,
  }],
  ownership_proof: {
    filename: String,
    path: String,
  },
});

const propertyModel = mongoose.model('properties', propertySchema);

module.exports = propertyModel;
