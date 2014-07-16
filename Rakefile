require 'rake'

task :default => [:release]

task :release do
  puts "Full release - building & pushing to production."
  `ember build --environment=production`
  `grunt publish-release`
end

task :canary do
  `ember build --environment=production`
  `grunt release`
end
