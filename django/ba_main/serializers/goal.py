from datetime import datetime

from rest_framework import serializers

from ba_main.models import YearlyGoal, ActionWay, Milestone
from ba_main.models.institution import Institution


class GoalRequestSerializer(serializers.Serializer):
    institution_id = serializers.IntegerField()
    year = serializers.CharField(max_length=4)


class MilestoneSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    date = serializers.CharField(source='formatted_date', required=False)


    class Meta:
        model = Milestone
        fields = '__all__'


class ActionWaySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    milestones = MilestoneSerializer(many=True)

    class Meta:
        model = ActionWay
        fields = '__all__'


def update_yearly_goal(yearly_goal_data):
    action_ways_data = yearly_goal_data.pop('action_ways')
    print('Yearly Goal Data', yearly_goal_data)
    goal, goal_created = YearlyGoal.objects\
        .update_or_create(defaults=yearly_goal_data, id=yearly_goal_data.get('id'))
    print('Description', goal.description)
    print('Reason', goal.reason)
    print('Goal Id', goal.id)
    print('WAYS LENGTH', action_ways_data)

    for action_way_data in action_ways_data:
        milestones_data = action_way_data.pop('milestones')
        action_way, action_way_created = ActionWay.objects.update_or_create(defaults=action_way_data, id=action_way_data.get('id'))
        print('action way', action_way.direction)

        for milestone_data in milestones_data:
            date: str = milestone_data.pop('formatted_date')
            milestone_data['date'] = datetime.strptime(date, '%d/%m/%Y').strftime('%Y-%m-%d')
            milestone, milestone_created = Milestone.objects\
                .update_or_create(defaults=milestone_data, id=milestone_data.get('id'))
            print('milestone', milestone.id)

class YearlyGoalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    action_ways = ActionWaySerializer(many=True)

    class Meta:
        model = YearlyGoal
        fields = '__all__'

    def update(self, instance: YearlyGoal, validated_data):
        update_yearly_goal(validated_data)
        return instance


class InstitutionYearlyGoalsSerializer(serializers.Serializer):
    excellence = serializers.SerializerMethodField()
    mission = serializers.SerializerMethodField()
    identity = serializers.SerializerMethodField()

    class Meta:
        model = Institution
        fields = ['id', 'year']

    def get_excellence(self, institution_instance: Institution):
        excellence = YearlyGoal.objects.get(
            institution__id=institution_instance.id,
            scope='EXCELLENCE',
            year__name=self.context.get('year_name'))
        return YearlyGoalSerializer(excellence).data

    def get_mission(self, institution_instance: Institution):
        mission = YearlyGoal.objects.get(
            institution__id=institution_instance.id,
            scope='MISSION',
            year__name=self.context.get('year_name'))
        return YearlyGoalSerializer(mission).data

    def get_identity(self, institution_instance: Institution):
        identity = YearlyGoal.objects.get(
            institution__id=institution_instance.id,
            scope='IDENTITY',
            year__name=self.context.get('year_name'))
        return YearlyGoalSerializer(identity).data


class InstitutionYearlyGoalsSaveSerializer(serializers.Serializer):
    excellence = YearlyGoalSerializer(required=False)
    mission = YearlyGoalSerializer(required=False)
    identity = YearlyGoalSerializer(required=False)

    class Meta:
        model = Institution
        fields = ['excellence', 'mission', 'identity']

    def create(self, validated_data):
        try:
            excellence_validated_data = validated_data.pop('excellence')
            update_yearly_goal(excellence_validated_data)
        except:
            pass
        try:
            mission_validated_data = validated_data.pop('mission')
            update_yearly_goal(mission_validated_data)
        except:
            pass
        try:
            identity_validated_data = validated_data.pop('identity')
            update_yearly_goal(identity_validated_data)
        except:
            pass
        return Institution()




