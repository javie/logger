guard 'shell' do
	watch(%r{^logger\.js}) { |m|
		n m[0], "Changed"
		`ant build`
	}
end
