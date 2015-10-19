var fs = require('fs');
var crypto = require('crypto');

bugData = JSON.parse(fs.readFileSync(__dirname+'/Data/bugData.json','utf8'));

var GetProjectList = function() {
   return Object.keys(bugData.projects);
}

var GetBugListForProject = function(proj) {
   var bugList = {statuses:[], priorities:[], bugs:[]};
   if(bugData.projects[proj]) {
      bugList.bugs = bugData.projects[proj];
   }
   bugList.priorities = GetPriorityList();
   bugList.statuses = GetStatusList();

   return bugList;
}

var GetPriorityList = function() {
   if(bugData.priorities) {
      return bugData.priorities;
   }
   return [];
}

var GetStatusList = function() {
   if(bugData.statuses) {
      return bugData.statuses;
   }
   return [];
}

var GetBugFromProject = function(proj, bugid) {
   if(!bugData.projects[proj]) {
      return {};
   }
   var project = bugData.projects[proj];
   for(var ctr = 0; ctr < project.length; ctr++) {
      var bug = project[ctr];
      if(bug.id == bugid) {
         return bug;
      }
   }

   return {};
}

var AddBugToProject = function(bug, proj) {
   if(!bugData.projects[proj]) {
      return;
   } 
  
   var newId = GetNewBugId();
   while(bugData.projects[proj][newId]) {
      newId = GetNewBugId();
   }   

   bug.id = newId;
   bugData.projects[proj].push(bug);

   WriteBugData(bugData);
}

var ModifyBugInProject = function(bug, proj) {
   if(!bugData.projects[proj]) {
      return;
   }   

   for(var i = 0; i < bugData.projects[proj].length; i++) {
      if(bugData.projects[proj][i].id == bug.id) {
         bugData.projects[proj][i] = bug;
         WriteBugData(bugData);
         break;
      }
   }
}

var CreateNewProject = function(proj) {
   if(bugData.projects[proj]) {
      return;
   }
   bugData.projects[proj] = [];

   WriteBugData(bugData);
}

var DeleteProject = function(proj) {
   if(!bugData.projects[proj]) {
      return;
   }
   delete bugData.projects[proj];
   WriteBugData(bugData);
}

var WriteBugData = function(data) {
   var dataStr = JSON.stringify(data);
   fs.writeFile(__dirname+'/Data/bugData.json', dataStr, function(err) {
      if(err) {
         console.log(err);
      }
   });
}

var GetNewBugId = function() {
   return crypto.randomBytes(3).toString('hex');
}

exports.GetProjectList = GetProjectList;
exports.GetBugListForProject = GetBugListForProject;
exports.GetPriorityList = GetPriorityList;
exports.GetStatusList = GetStatusList;
exports.GetBugFromProject = GetBugFromProject;
exports.AddBugToProject = AddBugToProject;
exports.CreateNewProject = CreateNewProject;
exports.DeleteProject = DeleteProject;
exports.ModifyBugInProject = ModifyBugInProject;
