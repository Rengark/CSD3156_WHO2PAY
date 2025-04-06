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

        let stpee = null;
        let stppr = null;
        if (split_type_payee === 'Equal Amounts')
        {
          stpee = 'SPLIT_EQUAL';
        }
        else {
          stpee = 'SPLIT_VALUE';
        }
        if (split_type_payer === 'Equal Amounts')
        {
            stppr = 'SPLIT_EQUAL';
        }
        else {
            stppr = 'SPLIT_VALUE';
        }
      // Validate required fields
      if (!transaction_name || !group_id || !total_amount || !details) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // 1. Insert into transactions table
    const mysqlFormattedDate = transaction_date 
      ? new Date(transaction_date).toISOString().slice(0, 19).replace('T', ' ') 
      : new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [txResult] = await dbTransactions.query(
      `INSERT INTO transactions (transaction_name, group_id, split_type_payee, split_type_payer, total_amount, transaction_date, last_edited_user, show_in_list) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction_name,
        group_id,
        stpee,
        stppr,
        total_amount,
        mysqlFormattedDate, // Use MySQL formatted date
        last_edited_user === '' ? -1 : parseInt(last_edited_user,10),
        show_in_list
      ]
    );
      const transaction_id = txResult.insertId;
        console.log("transaction data ", transaction_id, detail.playerid, detail.recipient_id, detail.amount);
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