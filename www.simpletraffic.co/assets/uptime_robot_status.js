      $(document).on('ready', function () {
          /*
          START UPTIME ROBOT
        */
          console.log("checking uptime");
          var uptimerobot_stats = [];
          $.ajax({
            method: "POST",
            cache: false,
            url: "https://api.uptimerobot.com/v2/getMonitors",
            data: { api_key: "ur218024-e593b9e0c66c5959c3433e9d", format: "json", logs: 1, "response_times": 1, "response_times_limit": 6, "logs_limit": 6 }
          })
          .done(function( data ) {
            var i = 0;
            var uptime_robot_overall_status = '';
            var color_class = 'success';
            //console.log( data.monitors );

            for (var key in data.monitors) {
              //console.log(data.monitors[key]);

              //calculate avg speed
              var uptimespeed = 0;
              var uptimespeed_text = '';
              for (var key2 in data.monitors[key].response_times) {
                uptimespeed += data.monitors[key].response_times[key2].value;
              }
              uptimespeed = uptimespeed / data.monitors[key].response_times.length;
              if (uptimespeed <= 400) {
                uptimespeed_text = '';
              } else if (uptimespeed <= 700) {
                uptimespeed_text = 'slower than normal';
              } else if (uptimespeed <= 950) {
                uptimespeed_text = 'currently very slow';
              } else {
                uptimespeed_text = 'currently extremly slow';
              } 

              uptimerobot_stats[i] = [];
              uptimerobot_stats[i]["name"] = data.monitors[key].friendly_name;
              uptimerobot_stats[i]["status"] = data.monitors[key].status == 2 ? "Online" : "Offline";    
              uptimerobot_stats[i]["speed"] = uptimespeed;
              uptimerobot_stats[i]["speed_text"] = uptimespeed_text;

              if(data.monitors[key].status !== 2) {
                if (uptime_robot_overall_status !== '') uptime_robot_overall_status += '<br>';
                uptime_robot_overall_status += '<i style="height: 16px;width: 16px;border-radius: 50%;display: inline-block; position: relative;top: 2px;" class="bg-danger mr-2"></i>' + uptimerobot_stats[i]["name"] + " is down ";
              } else if (uptimespeed_text !== '') {
                if (uptime_robot_overall_status !== '') uptime_robot_overall_status += '<br>';
                uptime_robot_overall_status += '<i style="height: 16px;width: 16px;border-radius: 50%;display: inline-block; position: relative;top: 2px;" class="bg-warning mr-2"></i>' + uptimerobot_stats[i]["name"] + " is " + uptimespeed_text + " ";
              }
              i++;
            }
            if (uptime_robot_overall_status == '') uptime_robot_overall_status = '<i style="height: 16px;width: 16px;border-radius: 50%;display: inline-block; position: relative;top: 2px;" class="bg-success mr-2"></i> All systems running normally';

            //Update status object
            var element = document.getElementById("uptime_robot_status_text");

            //If it isn't "undefined" and it isn't "null", then it exists.
            if(typeof(element) != 'undefined' && element != null){
                element.innerHTML = uptime_robot_overall_status;
            }
            //console.log(uptimerobot_stats);
            //console.log(uptime_robot_overall_status);

          });
          /*
            END - UPTIME ROBOT
          */
      });