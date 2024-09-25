# producer.rb

require 'bunny'

# Create a connection to RabbitMQ
connection = Bunny.new
connection.start

# Create a channel
channel = connection.create_channel

# Declare a queue
queue = channel.queue('hello')

# Publish a message to the queue
channel.default_exchange.publish('Hello, RabbitMQ!', routing_key: queue.name)
puts " [x] Sent 'Hello, RabbitMQ!'"

# Close the connection
connection.close
