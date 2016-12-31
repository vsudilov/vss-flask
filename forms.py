from wtforms import (TextField, SubmitField, 
                    validators, TextAreaField, 
                    IntegerField, validators, 
                    BooleanField)
from flask_wtf import Form


class ContactForm(Form):
  name = TextField("Name",validators=[validators.Required("Please enter your name."),validators.Length(max=30)])
  email = TextField("Email",validators=[validators.Required("Please enter your email"),validators.Email("Please enter your email address."),validators.Length(max=30)])
  subject = TextField("Subject",validators=[validators.Required("Please enter a subject."),validators.Length(max=30)])
  message = TextAreaField("Message",validators=[validators.Required("Cannot send an empty message!"),validators.Length(max=300)])
  submit = SubmitField("Send",validators=[validators.Required()])
  antispam = BooleanField("Do you agree to the terms?") #Hidden checkbox for bot trap
