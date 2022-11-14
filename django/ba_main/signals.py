from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _

from ba_main.models import YearlyGoal, Year, ActionWay, Milestone
from ba_main.models.institution import Institution
from ba_main.models.user import User
from proj.const import SYSTEM_EMAIL
from proj.services import EmailService


# import * as const from proj.const

@receiver(pre_save, sender=User)
def handle_pass_and_send_auth_details(sender, instance: User, *args, **kwargs):
    if instance.id: # if already created, check if email was changed
        old_instance: User = User.objects.get(id=instance.id)
        if old_instance.email == instance.email:
            return

    # if wasn't created yet, create username also
    # TODO: add site url to the registration details
    print('Sending temporary password to ', instance.email)
    new_password = User.objects.make_random_password()
    instance.username = instance.email
    instance.set_password(new_password)
    role_name = instance.role.name if instance.role else ''
    send_temporary_password(
        instance.email, 'סיסמתך הזמנית לאתר בני עקיבא',
        instance.first_name,
        instance.last_name,
        role_name,
        new_password,
    )


def create_yearly_goal(scope: str, institution: Institution, year: Year):
    goal_args = {'scope': scope, 'institution': institution, 'year': year }
    goal, goal_created = YearlyGoal.objects.get_or_create(scope=scope, institution__id=institution.id, year__id=year.id, defaults=goal_args)
    if not goal_created:
        action_way_args = {'goal': goal}
        to_create = 2 - len(ActionWay.objects.filter(goal__id=goal.id))
        for i in range(to_create):
            action_way = ActionWay.objects.create(goal__id=goal.id, defaults=action_way_args)
            milestone_args = {'action_way': action_way}
            milestone = Milestone.objects.get_or_create(action_way__id=action_way.id, defaults=milestone_args)
    else:
        action_way = ActionWay.objects.create(goal=goal)
        milestone = Milestone.objects.create(action_way=action_way)
        action_way2 = ActionWay.objects.create(goal=goal)
        milestone2 = Milestone.objects.create(action_way=action_way2)


@receiver(post_save, sender=Institution)
def create_default_goals(sender, instance: Institution, *args, **kwargs):
    current_year = Year.get_current_year()
    identity = create_yearly_goal(scope='IDENTITY', institution=instance, year=current_year)
    mission = create_yearly_goal(scope='MISSION', institution=instance, year=current_year)
    excellence = create_yearly_goal(scope='EXCELLENCE', institution=instance, year=current_year)




    
    

def send_temporary_password(
        email:str,
        subject: str,
        first_name:str,
        last_name: str,
        role_name: str,
        temporary_password: str):

    print(email, role_name, temporary_password)
    EmailService.send_email_template(
        _(subject),
        # _('סיסמתך הזמנית לאתר בני עקיבא'),
        SYSTEM_EMAIL,
        [email],
        'forgot_password.html',
        ({
            'name': "{} {}".format(first_name,last_name),
            'email': email,
            'role_name': role_name,
            'pass': temporary_password})
    )