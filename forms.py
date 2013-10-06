from wtforms import (TextField, SubmitField, 
                    validators, TextAreaField, 
                    IntegerField, validators, 
                    BooleanField)
from flask.ext.wtf import Form


class ContactForm(Form):
  name = TextField("Name",validators=[validators.Required("Please enter your name.")])
  email = TextField("Email",validators=[validators.Required("Please enter your email"),validators.Email("Please enter your email address.")])
  subject = TextField("Subject",validators=[validators.Required("Please enter a subject.")])
  message = TextAreaField("Message",validators=[validators.Required("Cannot send an empty message!")])
  submit = SubmitField("Send",validators=[validators.Required()])
  antispam = BooleanField("Do you agree to the terms?") #Hidden checkbox for bot trap