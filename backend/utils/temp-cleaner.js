const schedule = require("node-schedule");
const fs = require("fs/promises");

const tmpDir = __basedir + "/resource/tmp/";

//every day at 1am we clean the temp files
const cleanUpSchedule = "0 1 * * *";
schedule.scheduleJob(cleanUpSchedule, async () => {
  console.log("running job: clean up tmp files");
  try {
    const files = await fs.readdir(tmpDir, { withFileTypes: true });

    if (!Array.isArray(files)) {
      return;
    }
    const time = new Date().getTime(); //get ms since epoch
    //because of withFileTypes option, files are fs.Dirent objects instead of just string filenames.
    for (const file of files) {
      //make sure its a file before proceeding
      if (!file.isFile()) {
        continue;
      }

      const stats = await fs.stat(tmpDir + file.name);

      //if the time the file created is greater than or equal to 1 hour, delete i
      if (time - stats.birthtimeMs < 3.6e6) {
        console.log(
          "the temp file %s will not be removed due to not being old enough.",
          file.name
        );

        continue;
      }
      console.log("removing temp file %s", file.name);

      await fs.unlink(tmpDir + file.name);
      console.log("temp file %s removed", file.name);
    }
  } catch (err) {
    console.log(err);
  }

  console.log("Finished cleaning");
});

console.log("Scheduler setted");
