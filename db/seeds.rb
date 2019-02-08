# Instructions:- rails db:migrate:reset then rails db:seed

User.create!([
  {username: "sean", profile_picture: "https://cdn.animenewsnetwork.com/thumbnails/max700x700/cms/news.2/135613/dororo.jpg", email: "def@hotmail.com", password: "defdef", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2019-02-08 02:55:02.553748", updated_at: "2019-02-08 02:55:02.553748"},
  {username: "123", profile_picture: "http://worldartsme.com/images/123-clipart-1.jpg", email: "123@hotmail.com", password: "123123", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2019-02-08 02:55:02.553748", updated_at: "2019-02-08 02:55:02.553748"},
  {username: "1111", profile_picture: "https://vignette.wikia.nocookie.net/magi/images/e/e1/Morgiana_Current.png/revision/latest?cb=20161025220049", email: "1111@hotmail.com", password: "111111", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2019-02-08 02:55:02.553748", updated_at: "2019-02-08 02:55:02.553748"},
  {username: "kamuy", profile_picture: "https://prodimage.images-bn.com/pimages/9781421594880_p0_v1_s550x406.jpg", email: "kamuy@hotmail.com", password: "kam123", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2019-02-08 02:55:02.553748", updated_at: "2019-02-08 02:55:02.553748"},
  {username: "magus", profile_picture: "https://res.cloudinary.com/cashcloudinary/image/upload/v1549535920/diuv27cakyrpqmcbvx78.png", email: "cash@hotmail.com", password: "mag123", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2019-02-08 02:55:02.553748", updated_at: "2019-02-08 02:55:02.553748"}
])

Job.create!([
  {title: "bamboo", package_picture: "https://res.cloudinary.com/cashcloudinary/image/upload/v1549608735/v1fx4d6fol8aq3ibrbt6.jpg", start_location: "Pasir Ris Street 51, Singapore", end_location: "Claymore Hill, General Assembly, Singapore", date_pickup: "2019-02-03 13:57:00", date_delivery: "2019-02-03 13:57:00", accepted: true, completed: false, user_id: 4, acceptor_id: 1},
  {title: "paper", package_picture: "https://res.cloudinary.com/cashcloudinary/image/upload/v1549608891/cimvlprmfig6udrlkcfi.jpg", start_location: "VivoCity, Singapore", end_location: "Sengkang East Way, Singapore", date_pickup: "2019-02-03 13:52:00", date_delivery: "2019-02-03 13:52:00", accepted: true, completed: true, user_id: 1, acceptor_id: 3},
  {title: "tree", package_picture: nil, start_location: "Hougang Avenue 8, Singapore", end_location: "Redhill Close, Singapore", date_pickup: "2019-02-04 02:02:00", date_delivery: "2019-02-04 02:02:00", accepted: false, completed: false, user_id: 1, acceptor_id: nil},
  {title: "crate", package_picture: nil, start_location: "Punggol Field, Singapore", end_location: "Lor Chuan, Singapore", date_pickup: "2019-02-05 10:04:00", date_delivery: "2019-02-05 10:04:00", accepted: true, completed: false, user_id: 4, acceptor_id: 1},
  {title: "bottle", package_picture: nil, start_location: "Avis Car Rental - Changi Airport Terminal 2, Singapore", end_location: "Bayfront Avenue, Marina Bay Sands, Singapore", date_pickup: "2019-02-05 14:32:00", date_delivery: "2019-02-05 14:32:00", accepted: false, completed: false, user_id: 1, acceptor_id: nil},
  {title: "shoe", package_picture: nil, start_location: "Tampines North Drive 1, Singapore", end_location: "Bayfront Avenue, Marina Bay Sands, Singapore", date_pickup: "2019-02-07 03:07:00", date_delivery: "2019-02-07 03:07:00", accepted: false, completed: false, user_id: 2, acceptor_id: nil},
  {title: "marble", package_picture: "https://res.cloudinary.com/cashcloudinary/image/upload/v1549524627/wgvqfiolejyswj5jovk9.jpg", start_location: "Ang Mo Kio, Singapore", end_location: "Bayfront, Singapore", date_pickup: "2019-02-07 07:29:00", date_delivery: "2019-02-07 07:29:00", accepted: true, completed: false, user_id: 1, acceptor_id: 3},
  {title: "glass", package_picture: "https://res.cloudinary.com/cashcloudinary/image/upload/v1549529579/srhpivhrsplvdwjwwels.webp", start_location: "Woodlands Square, Causeway Point Shopping Centre, Singapore", end_location: "Airport Boulevard, Singapore", date_pickup: "2019-02-07 08:51:00", date_delivery: "2019-02-07 08:51:00", accepted: true, completed: true, user_id: 1, acceptor_id: 2},
  {title: "apple", package_picture: nil, start_location: "Harbourfront Place, Logitech Singapore Pte Ltd, Singapore", end_location: "Punggol, Singapore", date_pickup: "2019-02-06 12:52:00", date_delivery: "2019-02-06 12:52:00", accepted: false, completed: false, user_id: 2, acceptor_id: nil},
  {title: "rice", package_picture: nil, start_location: "Raffles Place, Singapore", end_location: "Lorong 1 Toa Payoh, Singapore", date_pickup: "2019-02-07 06:32:00", date_delivery: "2019-02-07 06:32:00", accepted: true, completed: false, user_id: 1, acceptor_id: 2}
])