const express = require('express');
const router = express.Router();
const multer = require('multer');
const propertyModel = require('../models/property');
const path = require('path');

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Route to add a new property
router.post('/add-asset', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'ownership_proof', maxCount: 1 }
]), async (req, res) => {
  try {
    const { unique_id, name, location, address, description, account_id,email, owner_name, metamask_id, value } = req.body;
    const { images, ownership_proof } = req.files;
    
    // Validate required fields
    if (!unique_id || !name || !location || !address || !description || !account_id || !owner_name || !metamask_id || !value || !images || !ownership_proof) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Perform MongoDB operations
    const propertyData = {
      unique_id,
      name,
      location,
      address,
      description,
      approved: true,
      value,
      owner_details:{
      account_id,
      owner_name,
      metamask_id,
      email,
      },
      images: images.map(image => ({ filename: image.originalname, path: image.buffer.toString('base64') })),
      ownership_proof: {
        filename: ownership_proof[0].originalname,
        path: ownership_proof[0].buffer.toString('base64')
      }
    };

    const savedProperty = await propertyModel.create(propertyData);

    console.log('Property created successfully:', savedProperty);
    res.status(201).json({ message: 'Property created successfully', savedProperty });
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/asset/:unique_id', async (req, res) => {
  const { unique_id } = req.params;

  try {
    // Query the database for the asset with the specified unique ID
    const assetDetails = await propertyModel.findOne({ unique_id });

    // If the asset is not found, return a 404 error response
    if (!assetDetails) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // If the asset is found, return its details in the response
    console.log('Fetched Asset Details:', assetDetails);
    res.status(200).json(assetDetails);
  } catch (error) {
    // If an error occurs during the database query, return a 500 error response
    console.error('Error fetching asset details:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update property details route
router.put('/update-asset/:unique_id', upload.array('images', 5), async (req, res) => {
  const uniqueId = req.params.unique_id;
  try {
    const property = await Property.findOneAndUpdate(
      { unique_id: uniqueId },
      {
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        location: req.body.location,
        images: req.files.map(file => ({
          filename: file.filename,
          path: file.path
        })),
        value: req.body.value,
        owner_details: req.body.owner_details,
        ownership_proof: {
          filename: req.file.filename,
          path: req.file.path
        }
      },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Failed to update property. Please try again.' });
  }
});

router.get('/all-assets', async (req, res) => {
  try {
    const allAssets = await propertyModel.find({approved:true});
    console.log('Fetched all assets:', allAssets);
    res.status(200).json(allAssets);
  } catch (error) {
    console.error('Error fetching all assets:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
router.get('/unapproved', async (req, res) => {
  try {
    const allAssets = await propertyModel.find({approved:false});
    console.log('Fetched all assets:', allAssets);
    res.status(200).json(allAssets);
  } catch (error) {
    console.error('Error fetching all assets:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
router.post('/update-approval', async (req, res) => {
  try {
    const { unique_id } = req.body;

    // Find the asset by unique_id and update the approved field to true
    const updatedAsset = await propertyModel.findOneAndUpdate(
      { unique_id },
      { $set: { approved: true } },
      { new: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.status(200).json({ message: 'Asset approved successfully', updatedAsset });
  } catch (error) {
    console.error('Error approving asset:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/user-assets/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const allAssets = await propertyModel.find(
      {
        'owner_details.email': email,
        approved: true
      }
    );

    const ownerIndex = allAssets.findIndex(asset => asset.owner_details.some(owner => owner.email === email));

    console.log('Fetched all assets:', allAssets);
    console.log('Owner index:', ownerIndex);

    res.status(200).json({ allAssets, ownerIndex });
  } catch (error) {
    console.error('Error fetching all assets:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.post('/sell/:email/:unique_id', async (req, res) => {
  const { email, unique_id } = req.params;
  const { percentage } = req.body;
  try {
    const property = await propertyModel.findOne({ 
      'owner_details.email': email,
      unique_id: unique_id
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Find the specific owner
    const owner = property.owner_details.find(owner => owner.email === email);

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Determine the status based on the percentage
    let status;
    if (percentage === 100) {
      status = 'full sale';
    } else if (percentage < 100) {
      status = 'partial sale';
    } else {
      return res.status(400).json({ error: 'Invalid percentage value' });
    }

    // Update owner's selling details
    owner.status = status;
    owner.selling_details={
      sell_percentage: percentage,
      token_available_count: owner.total_tokens * (percentage / 100)
    };

    await property.save();

    res.status(200).json({ message: 'Property status updated successfully' });
  } catch (error) {
    console.error('Error selling property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/request-add-asset', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'ownership_proof', maxCount: 1 }
]), async (req, res) => {
  try {
    const { unique_id, name, location, address, description, account_id,email, owner_name, metamask_id, value } = req.body;
    const { images, ownership_proof } = req.files;
    
    // Validate required fields
    if (!unique_id || !name || !location || !address || !description || !account_id || !owner_name || !metamask_id || !value || !images || !ownership_proof) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Perform MongoDB operations
    const propertyData = {
      unique_id,
      name,
      location,
      address,
      description,
      approved: false,
      value,
      owner_details:{
      account_id,
      owner_name,
      metamask_id,
      email,
      },
      images: images.map(image => ({ filename: image.originalname, path: image.buffer.toString('base64') })),
      ownership_proof: {
        filename: ownership_proof[0].originalname,
        path: ownership_proof[0].buffer.toString('base64')
      }
    };

    const savedProperty = await propertyModel.create(propertyData);

    console.log('Property created successfully:', savedProperty);
    res.status(201).json({ message: 'Property created successfully', savedProperty });
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
router.get('/upforsale/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const allAssets = await propertyModel.aggregate([
      {
        $match: {
          approved: true,
          $or: [
            { "owner_details.status": "partial sale" },
            { "owner_details.status": "full sale" }
          ],
          "owner_details.email": { $ne: email }, // Exclude assets where the main owner's email matches
          "owner_details.request_details.email": { $ne: email } // Exclude assets where request_details.email matches
        }
      },
      {
        $addFields: {
          owner_index: {
            $indexOfArray: ["$owner_details.email", email]
          }
        }
      }
    ]);

    console.log('Fetched all assets:', allAssets);
    
    // Modify the response JSON object to include the owner_index field
    const response = allAssets.map(asset => ({
      ...asset,
      owner_index: asset.owner_index
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching all assets:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



router.get('/inprogress/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const inProgressAssets = await propertyModel.find({
      approved: true,
      "owner_details.status": { $in: ["partial sale", "full sale"] },
      "owner_details.request_details": {
        $elemMatch: {
          email: email,
          response_status: "pending"
        }
      }
    });

    console.log('Fetched in progress assets:', inProgressAssets);
    res.status(200).json(inProgressAssets);
  } catch (error) {
    console.error('Error fetching in progress assets:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Endpoint to update property data with new request details
router.post('/request-data-update/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;

    // Define updated request details object
    const updatedRequestDetails = {
      value_type_count: req.body.value_type_count,
      liquid_type_count:req.body.liquid_type_count,
      buyer_name: req.body.buyer_name,
      account_id: req.body.account_id,
      email: req.body.email,
      metamask_id: req.body.metamask_id,
      response_status: "pending"
    };

    // Find the property owner by account ID
    const property = await propertyModel.findOne({ 'owner_details.account_id': accountId });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Find the owner index in the property's owner details array
    const ownerIndex = property.owner_details.findIndex(owner => owner.account_id === accountId);

    if (ownerIndex === -1) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    // Push the updated request details to the owner's request details array
    property.owner_details[ownerIndex].request_details.push(updatedRequestDetails);

    // Save the updated property data
    await property.save();

    // Respond with success message
    res.status(200).json({ success: true, message: 'Success' });
  } catch (error) {
    console.error('Error updating property data:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


router.get('/requests/:assetId/:email', async (req, res) => {
  const assetId = req.params.assetId;
  const email = req.params.email;
  try {
    // Find the property by unique ID
    const property = await propertyModel.findOne({ unique_id: assetId });
    if (!property) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Find the owner whose email matches the provided email
    const owner = property.owner_details.find(owner => owner.email === email);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found for the provided email' });
    }

    // Filter the request details to include only those with response_status "pending"
    const pendingRequests = owner.request_details.filter(request => request.response_status === "pending");

    // Send the filtered request details as a response
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error fetching request details:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



//confirming or declining access to transaction 

router.put('/requests/:action/:email/:accountId/:uniqueId', async (req, res) => {
  const { action, email, accountId, uniqueId } = req.params;
  try {
      // Find the property by unique ID
      const property = await propertyModel.findOne({ unique_id: uniqueId });
      if (!property) {
          return res.status(404).json({ message: "Property not found" });
      }

      // Find the owner index associated with the provided account ID
      const ownerIndex = property.owner_details.findIndex(owner => owner.email === email);
      if (ownerIndex === -1) {
          return res.status(404).json({ message: "Owner not found" });
      }

      // Find the request associated with the provided email
      const request = property.owner_details[ownerIndex].request_details.find(req => req.account_id === accountId);
      if (!request) {
          return res.status(404).json({ message: "Request not found" });
      }

      // Update the request status based on the action
      switch (action) {
          case 'approve':
              request.response_status = "payment-pending";
              break;
          case 'deny':
              request.response_status = "no-transaction";
              break;
          default:
              return res.status(400).json({ message: "Invalid action" });
      }

      await property.save();

      res.status(200).json({ message: `Request ${action}ed successfully` });
  } catch (error) {
      console.error('Error updating request details:', error);
      res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/pending/:email', async (req, res) => {
  const email = req.params.email;
  try {
    // Find all assets with status "partial sale" or "full sale"
    const assets = await propertyModel.find({
      $or: [
        { 'owner_details.status': 'partial sale' },
        { 'owner_details.status': 'full sale' }
      ]
    });

    // Filter assets where the current email has a request with response status "payment-pending"
    const pendingRequests = assets.reduce((pending, asset) => {
      const matchingRequests = asset.owner_details.reduce((requests, owner) => {
        const matchingRequest = owner.request_details.find(request => {
          return request.email === email && request.response_status === 'payment-pending';
        });
        if (matchingRequest) {
          requests.push({
            asset,
            owner,
            request_details: matchingRequest,
            selling_details: owner.selling_details // Assuming selling_details is available in owner
          });
        }
        return requests;
      }, []);
      pending.push(...matchingRequests);
      return pending;
    }, []);

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Add more property-related routes as needed

module.exports = router;
