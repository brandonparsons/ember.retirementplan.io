require 'rake'

task :default => [:release]

# FIXME: Check for any unstaged changes in the index as well.

task :check_revision, roles: :web do
  unless `git rev-parse HEAD` == `git rev-parse origin/master`
    puts "WARNING: HEAD is not the same as origin/master"
    puts "Run `git push` to sync changes."
    exit
  end
end

task :release do
  Rake::Task["check_revision"].invoke
  puts "Full release - building & pushing to production."
  `ember build --environment=production`
  `grunt publish-release`
end

task :canary do
  Rake::Task["check_revision"].invoke
  `ember build --environment=production`
  `grunt release`
end
