#!/usr/bin/env ruby

require "bunny"

connection = Bunny.new
connection.start

channel = connection.create_channel # tạo một channel

queue = channel.queue("hello") # tạo queue với tên giống với sender.rb
begin
    puts " [*] Waiting for messages. To exit press CTRL+C"
    queue.subscribe(block: true) do |_delivery_info, _properties, body|
      puts " [x] Received #{body}"
    end
  rescue Interrupt => _
    connection.close
    exit(0)
  end
  