# Crusoe
A lightweight issue-tracking tool

Originally meant to be run on a raspberry pi.  There is as little to this as 
possible.  No database.  Minimal interface.  Modest customizability.

Ideal for small 1 or 2 person projects, where you just want to keep a running 
list of To-Dos.

Runs on a node server.  Required packages:  Express, body-parser, crypto.  
Start by running node on bugtracker.js.

Design Choices:
-Issues are sorted by status, and then by priority.  
-Statuses are configurable in the Data/bugData.json file.  Add or remove 
statuses in the "statuses" key. Lower indexed items in this array receive 
higher priority.
-CSS classes of the same name as statuses are assigned to columns in the issue 
view.  This is done so you can style the output based on your own preferences 
for each status.
-Priorities are configurable in the Data/bugData.json file.  Add or remove
priorities in the "priorities" key.  Lower index items in this array receive 
lower priority.
-Issues are assigned a random Id.  This was done to encourage a low-defect
development style, where as few unresolved issues are available at any point 
in time.
-Issues cannot be deleted from a project.  However, all fields (except the id)
can be modified in any issue.  If you mistakenly create an issue, just modify
it until it is an issue you actually care about.  This was done to keep the 
project lightweight.
-Projects can be deleted.  The deletion button beside a project name works on
double-click.  This was done to minimize accidental deletions.  There is no 
confirmation dialog to protect you.  It is assumed that the users actions are
intentional.
-You can create a backup of the all your data simply by duplicating the 
Data/bugData.json file.  Once duplicated, store in the safe archival location 
of your choice.
