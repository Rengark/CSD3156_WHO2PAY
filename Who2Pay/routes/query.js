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

// get group name from group id
router.post('/getGroupName', async (req, res) => {
    try {
        const { groupID } = req.body;

        // Validate input
        if (!groupID) {
            return res.status(400).json({ message: 'Group ID is required' });
        }

        // Get group name from group ID
        const [groupResult] = await dbGroup.query(
            'SELECT * FROM groups_table WHERE id = ?',
            groupID
        );
        
        if (groupResult.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        return res.status(200).json({ groupName: groupResult[0].group_name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// delte group
router.post('/deleteGroup', async (req, res) => {
    try {
        const { groupID } = req.body;

        // Validate input
        if (!groupID) {
            return res.status(400).json({ message: 'Group ID is required' });
        }

        // Delete group from groups_table
        await dbGroup.query('DELETE FROM groups_table WHERE id = ?', [groupID]);

        // Delete members from user_profiles table
        await dbUsers.query('DELETE FROM user_profiles WHERE group_id = ?', [groupID]);

        res.status(200).json({ message: 'Group deleted successfully' });
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
            detail.payer_id === null ? -1 : parseInt(detail.payer_id,10),
            detail.recipient_id === null ? -1 : parseInt(detail.recipient_id,10),
            detail.amount
          ]
        );
      }
  
      res.status(201).json({
        success: true,
        transaction_id,
        message: 'Expense created successfully'
      });
  
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ error: 'Failed to create expense' });
    }
  });

// Add to query.js
router.post('/getTransaction', async (req, res) => {
    try {
      const { transaction_id } = req.body;
  
      if (!transaction_id) {
        return res.status(400).json({ error: 'Transaction ID is required' });
      }
  
      // Get transaction
      const [transaction] = await dbTransactions.query(
        `SELECT * FROM transactions WHERE transaction_id = ?`,
        [transaction_id]
      );
  
      if (transaction.length === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
  
      // Get details
      const [details] = await dbTransactions.query(
        `SELECT * FROM transaction_details WHERE transaction_id = ?`,
        [transaction_id]
      );
  
      res.json({
        transaction: transaction[0],
        details
      });
  
    } catch (error) {
      console.error('Error fetching transaction:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

// In query.js
router.post('/getAllTransactions', async (req, res) => {
    try {
      const { group_id } = req.body;
  
      // Query to get all transactions
      const [transactionsResult] = await dbTransactions.query(`
        SELECT 
          transaction_id AS id,
          transaction_name AS name,
          total_amount AS amount,
          DATE(transaction_date) AS date
        FROM transactions
        ${group_id ? 'WHERE group_id = ?' : ''}
        ORDER BY transaction_date DESC
      `, group_id ? [group_id] : []);
  
      if (transactionsResult.length === 0) {
        return res.status(404).json({ message: 'Transactions not found' });
        }
    // parse group results member by member
    
    const transactions = transactionsResult.map(tx => ({
        id: tx.id,
        name: tx.name,
        amount: tx.amount,
        date: tx.date.toISOString().split('T')[0]
    }));
   
    return res.status(200).json({ transactions });;
  
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.post('/getUserBalances', async (req, res) => {
    try {
      const { user_id } = req.body;
  
      if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      // Query to get all transactions where user is either payer or recipient
      const [balances] = await dbTransactions.query(`
        SELECT 
          u.user_profile_id AS id,
          u.name,
          SUM(
            CASE 
              WHEN td.payer_id = ? THEN -td.amount  -- User paid this amount
              WHEN td.recipient_id = ? THEN td.amount  -- User is owed this amount
              ELSE 0
            END
          ) AS amount
        FROM user_profiles u
        LEFT JOIN transaction_details td ON 
          (td.payer_id = u.user_profile_id OR td.recipient_id = u.user_profile_id)
        LEFT JOIN transactions t ON td.transaction_id = t.transaction_id
        WHERE u.user_profile_id IN (
          SELECT DISTINCT payer_id FROM transaction_details WHERE recipient_id = ?
          UNION
          SELECT DISTINCT recipient_id FROM transaction_details WHERE payer_id = ?
        )
        GROUP BY u.user_profile_id, u.name
      `, [user_id, user_id, user_id, user_id]);
  
      res.json(balances.map(b => ({
        ...b,
        amount: Number(b.amount) || 0 // Ensure amount is a number
      })));
  
    } catch (error) {
      console.error('Error fetching balances:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });

module.exports = router;