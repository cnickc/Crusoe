var express = require('express');
var bodyparser = require('body-parser');
var repo = require(__dirname+'/bugrepo');
var app = express();

app.engine('html', require('jade').__express);

app.use('/Static',express.static(__dirname+'/Static'));
app.use(bodyparser.json());

app.get('/', function(req, res) {
   res.sendFile(__dirname+'/Static/Views/index.html');
});

app.get('/Projects', function(req, res) {
   res.send(repo.GetProjectList());
});

app.get('/:project/List', function(req, res) {
   res.send(repo.GetBugListForProject(req.params.project));
});

app.delete('/:project', function(req, res) {
   repo.DeleteProject(req.params.project);
   res.sendStatus(200);
});

app.get('/BugPriorities', function(req, res) {
   res.send(repo.GetPriorityList());
});

app.get('/BugStatuses', function(req, res) {
   res.send(repo.GetStatusList());
});

app.get('/:project/:bugid', function(req, res) {
   res.send(repo.GetBugFromProject(req.params.project, req.params.bugid));
});

app.post('/NewProject', function(req, res) {
   if(req.body && req.body.project) {
      repo.CreateNewProject(req.body.project);
      res.sendStatus(201);
      return;
   }
   res.sendStatus(400);
});

app.post('/NewBug', function(req, res) {
   if(!req.body) {
      res.sendStatus(400);
      return;
   }

   if(!ValidBug(req.body)){
      res.sendStatus(400);
      return;
   }

   var proj = ParseProject(req.body);
   var bug = ParseBug(req.body);
   repo.AddBugToProject(bug, proj);
   res.sendStatus(201);
});

app.post('/ModifyBug', function(req, res) {
   if(!req.body) {
      console.log('bad body');
      res.sendStatus(400);
      return;
   }

   if(!ValidBug(req.body)) {
      console.log('invalid bug');
      console.log(JSON.stringify(req.body));
      res.sendStatus(400);
      return;
   }

   var proj = ParseProject(req.body);
   var bug = ParseBug(req.body);
   bug.id = req.body.id;
   repo.ModifyBugInProject(bug, proj);
   res.sendStatus(201);
});

var ValidBug = function(bug) {
   if(!bug.project || bug.project.length == 0) {
      return false;
   }
   if(!bug.title || bug.title.length == 0) {
      return false;
   }
   if(!bug.description) {
      return false;
   }
   
   var validStatuses = repo.GetStatusList();
   if(!bug.status || validStatuses.indexOf(bug.status) < 0) {
      return false;
   }
 
   var validPriorities = repo.GetPriorityList();
   if(!bug.priority || validPriorities.indexOf(bug.priority) < 0) {
      return false;
   }

   return true;
};

var ParseProject = function(data) {
   return data.project;
};

var ParseBug = function(data) {
   var bug = {};
   bug.status = data.status;
   bug.priority = data.priority;
   bug.title = data.title;
   bug.description = data.description;

   return bug;
};

app.use( function(err, req, res, next) {
   console.log(err);
   res.send('oops');
});

var server = app.listen(3000, function() {
   console.log('Starting bug tracking node app');
});
