extends Node2D

# Sample GDScript file
@export var speed: float = 200.0
@export var health: int = 100

var player_name: String = "Player"
var is_active: bool = true

func _ready():
	print("Scene is ready!")
	print("Player: ", player_name)

func _process(delta):
	if is_active:
		# Some sample logic here
		pass

func _on_button_pressed():
	print("Button was pressed!")
	health -= 10
	if health <= 0:
		print("Game Over!")
		is_active = false

func move_player(direction: Vector2):
	position += direction * speed * get_process_delta_time()

func take_damage(amount: int):
	health -= amount
	print("Health: ", health)
	
	if health <= 0:
		die()

func die():
	print("Player died!")
	is_active = false

func heal(amount: int):
	health += amount
	health = min(health, 100)  # Cap at 100
	print("Healed! Health: ", health)
