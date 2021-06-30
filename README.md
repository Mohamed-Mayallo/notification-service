# Notifications Service

Notifications Service is a Nodejs service used to notify customers in different ways.

#### Available notification types

- Push notifications
- SMS notifications

#### Available notification providers

- For push notifications

  - Firebase (default)
  - One Signal

- SMS notifications
  - AWS SNS (default)
  - Twilio

## Service architecture

- Nestjs is used to build this service which provides a great implementation for Dependency Injection and modularity structure

- The major modules of this service are:

  - Notification module
  - SMS module
  - Push module

- Notification module is the parent and the others are his children

- Composition over the inheritance. Composition is applied to implement Push and SMS sending behaviors

- Strategy design pattern is applied to the notification types (Push strategy and SMS strategy)

<p align="center">
  <img src="notification-service-architecture.png?raw=true" alt="Notification service architecture" title="Notification service architecture>
</p>

- With the help of this modularity and Strategy design pattern, we can extend this service in the ease with another notification type like Emails by implementing a new strategy for Emails

- Providers are implemented in the same manner. The strategy design pattern has been applied on providers by which we can add more providers only by adding their strategies

- The RESTful endpoints inputs take the same destinations array but under the hood, these destinations have to be valid phone numbers in the SMS endpoint and push tokens in the push endpoint

- If destinations input was more than one destination, We implement the -sendToMulti- approach in which notifications will be added into queues to avoid providers rate limit

- Configuration module has been provided to control the service behavior in run time without restarting the service. The available configuration for now:

  ```
    1- DEFAULT_SMS_SERVICE                    : Define the default SMS provider (AWS SNS)
    2- DEFAULT_PUSHER_SERVICE                 : Define the default SMS provider (Firebase)
    3- QUEUE_DELAY_IN_SEC                     : Number of seconds queue will wait to send the notifications (60 sec)
    4- LIMIT_OF_SENT_NOTIFICATIONS_IN_MINUTE  : Available notifications that will be sent in every queue job (10)
  ```

## How to run it

You can install this notification service via docker-compose.

```bash
docker-compose up
```

## How another microservice would contact this service to send a notification

Other microservices can contact this service in the RESTful way

#### To push notifications

- Endpoint:
  `http://localhost:4444/notifications/push`

- Required data:

```
1- destinations  : Array of push tokens (like fcmTokens in firebase)
2- enSubject     : English title of the pushed notification
3- arSubject     : Arabic title of the pushed notification
4- enBody        : English body of the pushed notification
5- arBody        : Arabic body of the pushed notification
6- favoriteLang  : Customer favorite language
```

#### To send SMS notifications

- Endpoint:
  `http://localhost:4444/notifications/sms`

- Required data:

```
1- destinations  : Array of valid phone numbers
2- enSubject     : English title of sent SMS notification
3- arSubject     : Arabic title of sent SMS notification
4- enBody        : English body of sent SMS notification
5- arBody        : Arabic body of sent SMS notification
6- favoriteLang  : Customer favorite language
```

## Testing

```bash
npm run test
```

## Future improvements

- Adding other notification approaches like (Emails notification)
- Using other notification providers
- Switch between providers in case of notification failure delivery
- Replace REST with gRPC
- Build a dedicated dashboard to monitor all notifications logs
- Complete the configuration module to control the whole service behaviors
- Implement an API Gateway to control authentication, authorization, routing and etc ...
