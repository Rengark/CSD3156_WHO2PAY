const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const dbUsers = require('../config/dbUsers'); // Assuming you have a separate db connection for users
const dbGroup = require('../config/dbGroup'); // Assuming you have a separate db connection for groups
const dbTransactions = require('../config/dbTransactions');

const router = express.Router();

router.post('/getMembers', async (req, res) => {
    try {
        const { groupID } = req.body;

        // Validate input
        if (!groupID) {
            return res.status(400).json({ message: 'Group name is required' });
        }

        const [password_enforced] = await dbGroup.query(
            'SELECT * FROM groups_table WHERE id = ?',
            groupID
        );
        if (password_enforced.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Get group ID from group name
        const [groupResult] = await dbUsers.query(
            'SELECT * FROM user_profiles WHERE group_id = ?',
            groupID
        );
        
        if (groupResult.length === 0) {
            return res.status(404).json({ message: 'Members not found' });
        }
        // parse group results member by member
        
        const members = groupResult.map(mem => ({
            id: mem.id,
            name: mem.name, 
            passwordset: !(mem.password === null),
            owner: mem.owner,
        }));
       
        return res.status(200).json({ members, password_enforced: password_enforced[0].password_enforced, groupName: password_enforced[0].group_name });
        // make a list
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/createOrUpdateExpense', async (req, res) => {
    try {
      // Destructure and validate request body
      const {
        transaction_name,
        group_id,
        split_type_payee,
        split_type_payer,
        total_amount,
        transaction_date,
        last_edited_user,
        show_in_list = true, // Default value
        details // Array of { payer_id, recipient_id, amount }
      } = req.body;
  
      console.log("Data:", {transaction_name,
        group_id,
        split_type_payee,
        split_type_payer,
        total_amount,
        transaction_date,
        last_edited_user,
        show_in_list, // Default value
        details});
      // Validate required fields
      if (!transaction_name || !group_id || !total_amount || !details) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // 1. Insert into transactions table
      const [txResult] = await dbTransactions.query(
        `INSERT INTO transactions (
          transaction_name,
          group_id,
          split_type_payee,
          split_type_payer,
          total_amount,
          transaction_date,
          last_edited_user,
          show_in_list
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction_name,
          group_id,
          split_type_payee,
          split_type_payer,
          total_amount,
          transaction_date || new Date(), // Use current date if not provided
          last_edited_user,
          show_in_list
        ]
      );
      const transaction_id = txResult.insertId;
  
      // 2. Insert transaction details
      for (const detail of details) {
        await dbTransactions.query(
          `INSERT INTO transaction_details (
            transaction_id,
            payer_id,
            recipient_id,
            amount
          ) VALUES (?, ?, ?, ?)`,
          [
            transaction_id,
            detail.payer_id,
            detail.recipient_id,
            detail.amount
          ]
        );
      }
  
      res.status(201).json({
        success: true,
        //transaction_id,
        message: 'Expense created successfully'
      });
  
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Failed to create expense' });
    }
  });

module.exports = router;